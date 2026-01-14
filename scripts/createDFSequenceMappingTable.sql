-- Create DF Sequence Mapping Table
-- This table maps MoPH codes to their corresponding DFSequence values
-- DFSequence represents the dosage form sequence used for drug classification

CREATE TABLE IF NOT EXISTS df_sequence_mapping (
    id INT PRIMARY KEY AUTO_INCREMENT,
    moph_code VARCHAR(50) NOT NULL UNIQUE,
    df_sequence VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_moph_code (moph_code),
    INDEX idx_df_sequence (df_sequence)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add a comment to the table
ALTER TABLE df_sequence_mapping COMMENT = 'Maps MoPH codes to their corresponding DFSequence values for dosage form classification';
