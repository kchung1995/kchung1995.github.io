class MyQueue() {
    private val first: Stack<Int> = Stack<Int>()
    private val second: Stack<Int> = Stack<Int>()
    private var peek: Int = -1

    fun push(x: Int) {
        first.push(x)
        if (peek == -1) peek = x
    }

    fun pop(): Int {
        while (first.isNotEmpty()) {
            second.push(first.pop())
        }
        val result = second.pop()
        peek = if (second.isEmpty()) -1 else second.peek()
        while (second.isNotEmpty()) {
            first.push(second.pop())
        }
        return result
    }

    fun peek(): Int {
        return peek
    }

    fun empty(): Boolean {
        return first.isEmpty()
    }

}

/**
 * Your MyQueue object will be instantiated and called as such:
 * var obj = MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */
