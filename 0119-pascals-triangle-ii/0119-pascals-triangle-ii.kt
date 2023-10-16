class Solution {
    fun getRow(rowIndex: Int): List<Int> {
        val result = IntArray(rowIndex + 1) { 1 }

        for (i in 2..rowIndex) {
            for (j in 1 until i) {
                result[i - j] += result[i - j - 1]
            }
        }

        return result.toList()
    }
}

