package org.boreas.web;

import org.eclipse.jetty.client.HttpClient;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;

public class AbstractHttpTest {
    public static WebLayer webLayer;
    public static HttpClient client;
    public static int port;
    public String host = "localhost";

    private static Thread thread;

    @BeforeClass
    public static void setupClass() throws Exception {
        webLayer = new WebLayer();
        thread = new Thread(() -> {
            try {
                webLayer.start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        thread.start();

        client = new HttpClient();
        client.start();

        while (!webLayer.isReady()) {
        }
        port = webLayer.getPort();
    }

    @AfterClass
    public static void cleanupClass() throws Exception {
        webLayer.stop();
        thread.join();
    }

    @Before
    public void setup() {
        while (!webLayer.isReady()){
        }
    }
}
