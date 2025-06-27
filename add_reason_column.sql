-- Add reason column to appointment table
ALTER TABLE appointment ADD COLUMN reason VARCHAR(500) DEFAULT NULL;

-- Update existing appointment with a default reason
UPDATE appointment SET reason = 'Khám tổng quát' WHERE reason IS NULL; 