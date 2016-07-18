package org.boreas.web.handler;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.boreas.mongodb.MongoStorage;
import org.bson.Document;

import com.mongodb.client.FindIterable;

@Path("")
public class HttpHandler {

    @GET
    @Path("{collection}")
    @Produces(MediaType.TEXT_HTML)
    public String getCollection(@PathParam("collection") String collectionName) {
        FindIterable<Document> iterable = MongoStorage.getDatabase().getCollection(collectionName).find();

        StringBuilder s = new StringBuilder();
        for (Document it : iterable) {
            s.append(it.toJson() + "<br>");
        }

        return s.toString();
    }

}
