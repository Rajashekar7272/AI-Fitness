"use client";

import ProfileHeader from "@/components/ProfileHeader";
import { GridBackground } from "@/components/spotlight-new";
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
import {
  Apple,
  Calendar,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Utensils,
} from "lucide-react";
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
  const [expandedFitness, setExpandedFitness] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedNutrition, setExpandedNutrition] = useState<{
    [key: string]: boolean;
  }>({});

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
        setError("Invalid plan format.");
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
        <GridBackground />
        <p className="text-center text-red-500">
          {error || "No plan available."}
        </p>
      </motion.div>
    );
  }

  const { fitness_plan, nutrition_plan } = plan;

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <ProfileHeader user={user} />

        {/* Fitness Plan */}
        <Card className="shadow-lg border border-gray-200 rounded-lg bg-black text-white">
          <CardHeader className="flex items-center space-x-2 text-2xl">
            <Dumbbell className="w-6 h-6 text-green-500" />
            <CardTitle>Fitness Plan Generated with AI</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>Weekly Schedule</span>
            </h3>
            <Table className="w-full border-2 border-gray-700">
              <TableHeader>
                <TableRow className="bg-black border-b border-gray-700">
                  <TableHead className="text-white">Day</TableHead>
                  <TableHead className="hidden sm:table-cell text-white">
                    Workout
                  </TableHead>
                  <TableHead className="hidden sm:table-cell text-white">
                    Rest
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(fitness_plan.weekly_schedule).map(
                  ([day, details]) => {
                    const expanded = expandedFitness[day] || false;
                    return (
                      <TableRow
                        key={day}
                        onClick={() =>
                          setExpandedFitness((prev) => ({
                            ...prev,
                            [day]: !prev[day],
                          }))
                        }
                        className="cursor-pointer text-sm h-[48px] bg-black hover:bg-gray-800 transition"
                      >
                        <TableCell>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                            <div className="flex justify-between items-center w-full">
                              <div className="flex items-center space-x-2">
                                <CalendarCheck className="w-4 h-4 text-green-400" />
                                <span>{dayNames[day]}</span>
                              </div>
                              <span className="sm:hidden">
                                {expanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </span>
                            </div>
                            {/* Expanded mobile content */}
                            {expanded && (
                              <div className="sm:hidden mt-2 text-gray-300 text-sm space-y-1 break-words whitespace-normal">
                                <div>
                                  <strong>Workout:</strong> {details.workout}
                                </div>
                                <div>
                                  <strong>Rest:</strong> {details.rest}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell whitespace-normal break-words">
                          {details.workout}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell whitespace-normal break-words">
                          {details.rest}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
            <h3 className="text-lg font-semibold mt-6 mb-2">Notes</h3>
            <p className="text-gray-400">{fitness_plan.notes}</p>
          </CardContent>
        </Card>

        {/* Nutrition Plan */}
        <Card className="shadow-lg border border-gray-200 rounded-lg">
          <CardHeader className="flex items-center space-x-2 text-2xl">
            <Utensils className="w-6 h-6 text-orange-500" />
            <CardTitle>Nutrition Plan Generated with AI</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Apple className="w-5 h-5 text-red-500" />
              <span>Daily Meals</span>
            </h3>
            <Table className="w-full border-2 border-gray-700">
              <TableHeader>
                <TableRow className="bg-black border-b border-gray-700">
                  <TableHead className="text-white">Meal</TableHead>
                  <TableHead className="hidden sm:table-cell text-white">
                    Description
                  </TableHead>
                  <TableHead className="hidden sm:table-cell text-white">
                    Protein
                  </TableHead>
                  <TableHead className="hidden sm:table-cell text-white">
                    Carbs
                  </TableHead>
                  <TableHead className="hidden sm:table-cell text-white">
                    Fats
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(nutrition_plan.daily_meals).map(
                  ([meal, details]) => {
                    const expanded = expandedNutrition[meal] || false;
                    return (
                      <TableRow
                        key={meal}
                        onClick={() =>
                          setExpandedNutrition((prev) => ({
                            ...prev,
                            [meal]: !prev[meal],
                          }))
                        }
                        className="cursor-pointer bg-black hover:bg-gray-900 transition"
                      >
                        <TableCell>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                            <div className="flex justify-between items-center w-full">
                              <div className="flex items-center space-x-2">
                                <Utensils className="w-4 h-4 text-green-400" />
                                <span>
                                  {meal.charAt(0).toUpperCase() + meal.slice(1)}
                                </span>
                              </div>
                              <span className="sm:hidden">
                                {expanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </span>
                            </div>
                            {/* Expanded mobile content */}
                            {expanded && (
                              <div className="sm:hidden mt-2 text-gray-300 text-sm space-y-1 break-words whitespace-normal">
                                <div>
                                  <strong>Description:</strong>{" "}
                                  {details.description}
                                </div>
                                <div>
                                  <strong>Protein:</strong> {details.protein}
                                </div>
                                <div>
                                  <strong>Carbs:</strong> {details.carbs}
                                </div>
                                <div>
                                  <strong>Fats:</strong> {details.fats}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {details.description}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {details.protein}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {details.carbs}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {details.fats}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
            <h3 className="text-lg font-semibold mt-6 mb-2">Notes</h3>
            <p className="text-gray-600">{nutrition_plan.notes}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
