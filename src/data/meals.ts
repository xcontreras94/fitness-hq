export interface Meal {
  name: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealDay {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal;
}

const snacks: Meal = {
  name: 'Orgain shake + Clif bar',
  ingredients: ['2 scoops Orgain protein powder', '8 oz water', '1 Clif bar'],
  calories: 510,
  protein: 51,
  carbs: 61,
  fat: 12,
};

export const mealPlan: MealDay[] = [
  {
    day: 'Monday',
    breakfast: {
      name: '4 scrambled eggs + smoked salmon',
      ingredients: ['4 large eggs', '3 oz smoked salmon', '1 tsp olive oil'],
      calories: 380,
      protein: 40,
      carbs: 2,
      fat: 24,
    },
    lunch: {
      name: 'Chicken breast bowl',
      ingredients: ['6 oz chicken breast', '1 cup cooked white rice', '1 cup roasted vegetables', '1 tbsp olive oil'],
      calories: 560,
      protein: 52,
      carbs: 58,
      fat: 9,
    },
    dinner: {
      name: 'Salmon + sweet potato + broccoli',
      ingredients: ['6 oz salmon fillet', '1 medium sweet potato', '1 cup broccoli', '1 tbsp olive oil'],
      calories: 530,
      protein: 47,
      carbs: 41,
      fat: 21,
    },
    snacks,
  },
  {
    day: 'Tuesday',
    breakfast: {
      name: 'Greek yogurt bowl (granola, berries, PB)',
      ingredients: ['1 cup Fage 0% Greek yogurt', '1/4 cup granola', '1/2 cup mixed berries', '1 tbsp peanut butter'],
      calories: 365,
      protein: 30,
      carbs: 41,
      fat: 11,
    },
    lunch: {
      name: 'Ground turkey taco bowl',
      ingredients: ['6 oz lean ground turkey (93%)', '1 cup cooked white rice', '1/4 cup black beans', '1/4 cup salsa', 'shredded romaine'],
      calories: 510,
      protein: 46,
      carbs: 60,
      fat: 10,
    },
    dinner: {
      name: 'Sirloin steak + rice + greens',
      ingredients: ['8 oz sirloin steak', '1 cup cooked white rice', '1 cup mixed greens', '1 tbsp olive oil'],
      calories: 660,
      protein: 62,
      carbs: 48,
      fat: 22,
    },
    snacks,
  },
  {
    day: 'Wed',
    breakfast: {
      name: '4 scrambled eggs + smoked salmon',
      ingredients: ['4 large eggs', '3 oz smoked salmon', '1 tsp olive oil'],
      calories: 380,
      protein: 40,
      carbs: 2,
      fat: 24,
    },
    lunch: {
      name: 'Tuna + avocado on whole grain',
      ingredients: ['5 oz canned tuna in water', '1/2 avocado', '2 slices whole grain bread', '1 tbsp mustard'],
      calories: 430,
      protein: 44,
      carbs: 36,
      fat: 14,
    },
    dinner: {
      name: 'Chicken thighs + lentils + roasted veg',
      ingredients: ['6 oz chicken thighs (boneless, skinless)', '1/2 cup cooked lentils', '1 cup roasted vegetables', '1 tbsp olive oil'],
      calories: 590,
      protein: 50,
      carbs: 35,
      fat: 28,
    },
    snacks,
  },
  {
    day: 'Thu',
    breakfast: {
      name: 'Greek yogurt bowl (granola, berries, PB)',
      ingredients: ['1 cup Fage 0% Greek yogurt', '1/4 cup granola', '1/2 cup mixed berries', '1 tbsp peanut butter'],
      calories: 365,
      protein: 30,
      carbs: 41,
      fat: 11,
    },
    lunch: {
      name: 'Chicken breast bowl (quinoa)',
      ingredients: ['6 oz chicken breast', '1 cup cooked quinoa', '1 cup roasted vegetables', '1 tbsp olive oil'],
      calories: 620,
      protein: 60,
      carbs: 54,
      fat: 13,
    },
    dinner: {
      name: 'Salmon + sweet potato + broccoli',
      ingredients: ['6 oz salmon fillet', '1 medium sweet potato', '1 cup broccoli', '1 tbsp olive oil'],
      calories: 530,
      protein: 47,
      carbs: 41,
      fat: 21,
    },
    snacks,
  },
  {
    day: 'Fri',
    breakfast: {
      name: '4 scrambled eggs + smoked salmon',
      ingredients: ['4 large eggs', '3 oz smoked salmon', '1 tsp olive oil'],
      calories: 380,
      protein: 40,
      carbs: 2,
      fat: 24,
    },
    lunch: {
      name: 'Ground turkey taco bowl',
      ingredients: ['6 oz lean ground turkey (93%)', '1 cup cooked white rice', '1/4 cup black beans', '1/4 cup salsa', 'shredded romaine'],
      calories: 510,
      protein: 46,
      carbs: 60,
      fat: 10,
    },
    dinner: {
      name: 'Shrimp stir fry + rice + greens',
      ingredients: ['8 oz shrimp (peeled, deveined)', '1 cup cooked white rice', '1 cup mixed vegetables', '1 tbsp soy sauce', '1 tsp sesame oil'],
      calories: 560,
      protein: 52,
      carbs: 52,
      fat: 14,
    },
    snacks,
  },
  {
    day: 'Sat',
    breakfast: {
      name: 'Greek yogurt bowl + hard boiled eggs',
      ingredients: ['1 cup Fage 0% Greek yogurt', '2 hard boiled eggs', '1/4 cup granola', '1/2 cup mixed berries', '1 tbsp peanut butter'],
      calories: 505,
      protein: 42,
      carbs: 42,
      fat: 21,
    },
    lunch: {
      name: 'Tuna + avocado on whole grain',
      ingredients: ['5 oz canned tuna in water', '1/2 avocado', '2 slices whole grain bread', '1 tbsp mustard'],
      calories: 430,
      protein: 44,
      carbs: 36,
      fat: 14,
    },
    dinner: {
      name: 'Chicken thighs + sweet potato + broccoli',
      ingredients: ['8 oz chicken thighs (boneless, skinless)', '1 medium sweet potato', '1 cup broccoli', '1 tbsp olive oil'],
      calories: 680,
      protein: 58,
      carbs: 41,
      fat: 33,
    },
    snacks,
  },
  {
    day: 'Sun',
    breakfast: {
      name: '4 scrambled eggs + smoked salmon',
      ingredients: ['4 large eggs', '3 oz smoked salmon', '1 tsp olive oil'],
      calories: 380,
      protein: 40,
      carbs: 2,
      fat: 24,
    },
    lunch: {
      name: 'Chicken breast + quinoa + roasted veg',
      ingredients: ['6 oz chicken breast', '1 cup cooked quinoa', '1 cup roasted vegetables', '1 tbsp olive oil'],
      calories: 620,
      protein: 60,
      carbs: 54,
      fat: 13,
    },
    dinner: {
      name: 'Ground turkey stir fry + rice + veg',
      ingredients: ['6 oz lean ground turkey (93%)', '1 cup cooked white rice', '1 cup mixed vegetables', '1 tbsp soy sauce', '1 tsp sesame oil'],
      calories: 490,
      protein: 44,
      carbs: 58,
      fat: 12,
    },
    snacks,
  },
];
