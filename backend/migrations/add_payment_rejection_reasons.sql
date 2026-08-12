-- Migration: Add payment rejection reason columns
-- Purpose: Store individual rejection reasons for each player's payment

USE game;

-- Add payment rejection reason columns for creator and challenger
ALTER TABLE challenges 
ADD COLUMN payment_rejection_reason_creator VARCHAR(255) NULL AFTER payment_status_creator,
ADD COLUMN payment_rejection_reason_challenger VARCHAR(255) NULL AFTER payment_status_challenger;

-- Add index for easier querying
CREATE INDEX idx_challenges_payment_status ON challenges(payment_status_creator, payment_status_challenger);
