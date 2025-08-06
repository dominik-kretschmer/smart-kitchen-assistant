/*
  Warnings:

  - You are about to drop the column `amount` on the `Stock` table. All the data in the column will be lost.
  - Made the column `calories` on table `FullIngredient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `carbs` on table `FullIngredient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fat` on table `FullIngredient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `protein` on table `FullIngredient` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `unit` to the `ShoppingList` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `amount` on the `ShoppingList` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `quantity` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Ingredient" ALTER COLUMN "calories" SET NOT NULL,
ALTER COLUMN "carbs" SET NOT NULL,
ALTER COLUMN "fat" SET NOT NULL,
ALTER COLUMN "protein" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."ShoppingList" ADD COLUMN     "unit" TEXT NOT NULL,
DROP COLUMN "amount",
ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Stock" DROP COLUMN "amount",
ADD COLUMN     "quantity" TEXT NOT NULL;
