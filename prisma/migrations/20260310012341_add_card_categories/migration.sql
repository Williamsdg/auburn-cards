-- CreateEnum
CREATE TYPE "CardCategory" AS ENUM ('SPORTS', 'POKEMON', 'TCG');

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "cardNumber" TEXT,
ADD COLUMN     "category" "CardCategory" NOT NULL DEFAULT 'SPORTS',
ADD COLUMN     "setName" TEXT,
ALTER COLUMN "sport" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "category" TEXT DEFAULT 'SPORTS',
ADD COLUMN     "setName" TEXT,
ADD COLUMN     "sport" TEXT;
