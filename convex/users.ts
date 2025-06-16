import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Mutation to sync a new user into the database (if not already present)
export const syncUser = mutation({
  // Define expected arguments and their types
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()), // Optional image URL
  },
  handler: async (ctx, args) => {
    // Check if a user with the same clerkId already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    // If user exists, do nothing
    if (existingUser) return;

    // Insert the new user into the "users" table
    return await ctx.db.insert("users", args);
  },
});

// Mutation to update an existing user's data
export const updateUser = mutation({
  // Define expected arguments and their types
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()), // Optional image URL
  },
  handler: async (ctx, args) => {
    // Fetch the existing user using a secondary index on clerkId
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    // If user not found, do nothing
    if (!existingUser) return;

    // Update the user's data with the provided values
    return await ctx.db.patch(existingUser._id, args);
  },
});
