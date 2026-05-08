export interface MealDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  protein: number;
}

export const mealPlan: MealDay[] = [
  { day: 'Mon', breakfast: '4 scrambled eggs + turkey bacon',     lunch: 'Chicken breast bowl (rice + roasted veg)',    dinner: 'Salmon + sweet potato + broccoli',        protein: 185 },
  { day: 'Tue', breakfast: 'Greek yogurt (Fage) + almonds',       lunch: 'Ground turkey taco bowl',                    dinner: 'Sirloin steak + rice + greens',            protein: 190 },
  { day: 'Wed', breakfast: '4 scrambled eggs + smoked salmon',    lunch: 'Tuna + avocado on whole grain bread',         dinner: 'Chicken thighs + lentils + roasted veg',   protein: 185 },
  { day: 'Thu', breakfast: 'Greek yogurt (Fage) + almonds',       lunch: 'Chicken breast bowl (quinoa + roasted veg)',  dinner: 'Salmon + sweet potato + broccoli',         protein: 185 },
  { day: 'Fri', breakfast: '4 scrambled eggs + smoked salmon',    lunch: 'Ground turkey taco bowl',                    dinner: 'Sirloin steak + rice + greens',            protein: 190 },
  { day: 'Sat', breakfast: 'Greek yogurt + 2 hard boiled eggs',   lunch: 'Tuna + avocado on whole grain bread',         dinner: 'Chicken thighs + sweet potato + broccoli', protein: 185 },
  { day: 'Sun', breakfast: '4 scrambled eggs + smoked salmon',    lunch: 'Chicken breast + quinoa + roasted veg',       dinner: 'Ground turkey stir fry + rice + veg',      protein: 185 },
];
