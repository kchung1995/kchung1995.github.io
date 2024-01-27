class Solution {
    companion object {
        private const val MOD = 1_000_000_007
        private const val MAX_VALUE = 1001
    }
    
    fun kInversePairs(n: Int, k: Int): Int {
        val memo = Array(MAX_VALUE) { IntArray(MAX_VALUE) { -1 } }
        return memoization(n, k, memo)
    }

    private fun memoization(n: Int, k: Int, memo: Array<IntArray>): Int {
        when {
            n == 0 -> return 0
            k == 0 -> return 1
            memo[n][k] != -1 -> return memo[n][k]
        }

        var inverse: Int = 0
        val boundary = minOf(k, n - 1)
        for (i in 0 .. boundary) {
            inverse = (inverse + memoization(n - 1, k - i, memo)) % MOD
        }
        memo[n][k] = inverse
        return inverse
    }
}

