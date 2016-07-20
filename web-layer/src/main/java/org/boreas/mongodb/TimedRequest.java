package org.boreas.mongodb;

public class TimedRequest <T> {
    private long elapsed = 0;

    public T run(TimedRunnable<T> r) {
        long start = System.nanoTime();
        T value = r.run();
        elapsed = System.nanoTime() - start;
        return value;
    }

    public interface TimedRunnable <T> {
        T run();
    }

    public long getElapsed() {
        return elapsed;
    }
}
