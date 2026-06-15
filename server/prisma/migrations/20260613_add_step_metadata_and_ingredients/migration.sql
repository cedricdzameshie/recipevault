-- Add optional metadata to recipe steps
ALTER TABLE "Step"
ADD COLUMN "prepNote" TEXT,
ADD COLUMN "timerMinutes" INTEGER;

-- Store ingredients used by individual recipe steps
CREATE TABLE "StepIngredient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" TEXT,
    "unit" TEXT,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stepId" TEXT NOT NULL,

    CONSTRAINT "StepIngredient_pkey" PRIMARY KEY ("id")
);

-- Delete step ingredients when their parent step is deleted
ALTER TABLE "StepIngredient"
ADD CONSTRAINT "StepIngredient_stepId_fkey"
FOREIGN KEY ("stepId")
REFERENCES "Step"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;