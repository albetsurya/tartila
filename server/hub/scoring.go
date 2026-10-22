package hub

/**
 * Server-side Speed Scoring Formula
 * skor = 1000 - (time_taken_ms / max_time_ms * 500)
 * Minimum score if correct: 500 points
 * 0 points if incorrect
 */
func CalculateScore(isCorrect bool, timeTakenMs int64, maxTimeMs int64) int {
	if !isCorrect {
		return 0
	}
	if maxTimeMs <= 0 {
		maxTimeMs = 20000 // default 20s
	}
	if timeTakenMs < 0 {
		timeTakenMs = 0
	}
	if timeTakenMs > maxTimeMs {
		timeTakenMs = maxTimeMs
	}

	ratio := float64(timeTakenMs) / float64(maxTimeMs)
	score := 1000 - int(ratio*500.0)

	if score < 500 {
		score = 500
	}
	if score > 1000 {
		score = 1000
	}
	return score
}
