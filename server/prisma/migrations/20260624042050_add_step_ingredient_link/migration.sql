-- AlterTable
ALTER TABLE "StepIngredient" ADD COLUMN     "ingredientId" TEXT;

-- AddForeignKey
ALTER TABLE "StepIngredient" ADD CONSTRAINT "StepIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
