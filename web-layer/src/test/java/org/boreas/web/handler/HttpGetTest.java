package org.boreas.web.handler;

import static org.junit.Assert.assertTrue;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

import org.boreas.web.AbstractHttpTest;
import org.eclipse.jetty.client.api.ContentResponse;
import org.junit.Test;


public class HttpGetTest extends AbstractHttpTest{

    @Test
    public void testGet() throws InterruptedException, ExecutionException, TimeoutException {
        ContentResponse response = client.GET("http://" + host + ":" + port + "/" + "blob");
        System.out.println(response.getContentAsString());
        assertTrue(response.getStatus() == 200);
    }
}
