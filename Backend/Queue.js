class Node {
    constructor(data, next = null) {
        this.data = data;
        this.next = next;
    }
}

class Queue {
    constructor() {
        this.head = null;
        this.size = 0;
        this.tail = null;
    }

    enqueue(data) {
        let node = new Node(data);

        if (!this.head) {
            this.head = node;
            this.tail = this.head;
        } else {
            this.tail.next = node;
            this.tail = node;
        }
        this.size++;
    }

    remove(data) {
        if (!this.head) return false;
        if (this.head.data === data) {
            this.head = this.head.next;
            this.size--;
            return true;
        }

        let current = this.head.next;
        let prev = this.head;

        while (current.data !== data) {
            if (current.next === null) {
                return false;
            }
            prev = current;
            current = current.next;
        }

        prev.next = current.next;
        this.size--;
        return true;
    }

    dequeue() {
        if (this.head) {
            this.head = this.head.next;
            this.size--;
        }
    }

    first() {
        return this.head ? this.head.data : null;
    }

    print() {
        let current = this.head;
        if (!current) {
            console.log(null);
            return;
        }
        while (current) {
            console.log(current.data);
            current = current.next;
        }
    }
}

module.exports = Queue;
