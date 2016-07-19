package org.boreas.web.handler;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.boreas.mongodb.MongoStorage;
import org.bson.Document;

import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.model.Filters;

@Path("")
public class HttpHandler {

    @GET
    @Path("{collection}")
    @Produces(MediaType.TEXT_HTML)
    public String getCollection(@PathParam("collection") String collectionName) {
        FindIterable<Document> iterable = MongoStorage.getDatabase().
                getCollection(collectionName).
                find();

        StringBuilder s = new StringBuilder();
        for (Document it : iterable) {
            s.append(it.toJson() + "<br>");
        }

        return s.toString();
    }

    @GET
    @Path("{collection}/latest")
    @Produces(MediaType.TEXT_HTML)
    public String getLatestFromCollection(@PathParam("collection") String collectionName) {
        FindIterable<Document> iterable = MongoStorage.getDatabase().
                getCollection(collectionName).
                find().
                sort(new BasicDBObject("_id", -1)).
                limit(1);

        StringBuilder s = new StringBuilder();
        for (Document it : iterable) {
            s.append(it.toJson());
        }

        return s.toString();
    }

    @GET
    @Path("{collection}/{field}/{value}")
    @Produces(MediaType.TEXT_HTML)
    public String getCollectionByField(@PathParam("collection") String collectionName,
                                    @PathParam("field") String field,
                                    @PathParam("value") String value) {
        FindIterable<Document> iterable = MongoStorage.getDatabase().
                getCollection(collectionName).
                find(Filters.eq(field, value));

        StringBuilder s = new StringBuilder();
        for (Document it : iterable) {
            s.append(it.toJson() + "<br>");
        }

        return s.toString();
    }

    @GET
    @Path("{collection}/{field}/{value}/latest")
    @Produces(MediaType.TEXT_HTML)
    public String getLatestFromCollectionByField(@PathParam("collection") String collectionName,
                                       @PathParam("field") String field,
                                       @PathParam("value") String value) {
        FindIterable<Document> iterable = MongoStorage.getDatabase().
                getCollection(collectionName).
                find(Filters.eq(field, value)).
                sort(new BasicDBObject("_id", -1)).
                limit(1);

        StringBuilder s = new StringBuilder();
        for (Document it : iterable) {
            s.append(it.toJson());
        }

        return s.toString();
    }

}
