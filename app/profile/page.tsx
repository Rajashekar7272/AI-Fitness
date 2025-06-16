"use client";

import ProfileHeader from "@/components/ProfileHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Apple, Calendar, Dumbbell, Utensils } from "lucide-react";
import { useEffect, useState } from "react";

interface WorkoutDay {
  workout: string;
  rest: string;
}

interface FitnessPlan {
  weekly_schedule: { [key: string]: WorkoutDay };
  notes: string;
}

interface Meal {
  description: string;
  protein: string;
  carbs: string;
  fats: string;
}

interface NutritionPlan {
  daily_meals: { [key: string]: Meal };
  notes: string;
}

interface Plan {
  fitness_plan: FitnessPlan;
  nutrition_plan: NutritionPlan;
}

const dayNames: Record<string, string> = {
  day_1: "Monday",
  day_2: "Tuesday",
  day_3: "Wednesday",
  day_4: "Thursday",
  day_5: "Friday",
  day_6: "Saturday",
  day_7: "Sunday",
};

export default function PlanPage() {
  const { user } = useUser();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedPlan = sessionStorage.getItem("fitnessPlan");
    if (storedPlan) {
      try {
        const parsedPlan = JSON.parse(storedPlan);
        if (parsedPlan.error) {
          setError(parsedPlan.error);
        } else {
          setPlan(parsedPlan as Plan);
        }
      } catch (error) {
        console.error("Failed to parse plan:", error);
        if (error instanceof Error) {
          setError(`Invalid plan format: ${error.message}`);
        } else {
          setError("Invalid plan format: Unknown error");
        }
      }
    } else {
      setError("No plan found in storage.");
    }
  }, []);

  if (error || !plan) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto px-4 py-10"
      >
        <p className="text-center text-red-500">
          {error || "No plan available."}
        </p>
      </motion.div>
    );
  }

  const { fitness_plan, nutrition_plan } = plan;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <ProfileHeader user={user} />
      {/* Fitness Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 rounded-lg">
          <CardHeader className="flex items-center space-x-2  text-white text-2xl">
            <Dumbbell className="w-6 h-6 text-green-500" />
            <CardTitle>Fitness Plan</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>Weekly Schedule</span>
            </h3>
            <div className="overflow-visible">
              <Table className="w-full border border-gray-200 rounded-lg">
                <TableHeader>
                  <TableRow className="bg-black">
                    <TableHead className="font-semibold text-white rounded-tl-lg">
                      Day
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      Workout
                    </TableHead>
                    <TableHead className="font-semibold text-white rounded-tr-lg">
                      Rest
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(fitness_plan.weekly_schedule).map(
                    ([day, details], index) => (
                      <TableRow
                        key={day}
                        className="hover:bg-gray-800 transition-colors duration-200 animate-slide-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span>
                              {dayNames[day] || day.replace("day_", "Day ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{details.workout}</TableCell>
                        <TableCell>{details.rest}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
            <h3 className="text-lg font-semibold mt-6 mb-2 flex items-center space-x-2">
              <span>Notes</span>
            </h3>
            <p className="text-gray-600">{fitness_plan.notes}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Nutrition Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 rounded-lg">
          <CardHeader className="flex items-center space-x-2 text-2xl">
            <Utensils className="w-6 h-6 text-orange-500" />
            <CardTitle>Nutrition Plan</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Apple className="w-5 h-5 text-red-500" />
              <span>Daily Meals</span>
            </h3>
            <div className="overflow-visible">
              <Table className="w-full border border-gray-200 rounded-lg">
                <TableHeader>
                  <TableRow className="">
                    <TableHead className="font-semibold text-gray-100 rounded-tl-lg">
                      Meal
                    </TableHead>
                    <TableHead className="font-semibold text-gray-100">
                      Description
                    </TableHead>
                    <TableHead className="font-semibold text-gray-100">
                      Protein
                    </TableHead>
                    <TableHead className="font-semibold text-gray-100">
                      Carbs
                    </TableHead>
                    <TableHead className="font-semibold text-gray-100 rounded-tr-lg">
                      Fats
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(nutrition_plan.daily_meals).map(
                    ([meal, details], index) => (
                      <TableRow
                        key={meal}
                        className="hover:bg-gray-800 transition-colors duration-200 animate-slide-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Utensils className="w-4 h-4 text-green-400" />
                            <span>
                              {meal.charAt(0).toUpperCase() + meal.slice(1)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{details.description}</TableCell>
                        <TableCell>{details.protein}</TableCell>
                        <TableCell>{details.carbs}</TableCell>
                        <TableCell>{details.fats}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
            <h3 className="text-lg font-semibold mt-6 mb-2 flex items-center space-x-2">
              <span>Notes</span>
            </h3>
            <p className="text-gray-600">{nutrition_plan.notes}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
