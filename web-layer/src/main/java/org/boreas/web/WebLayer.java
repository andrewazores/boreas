/*
    Boreas
    Copyright 2016 Jie Kang, Anirudh Mukundan
    This file is part of Boreas.

    Boreas is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Boreas is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Boreas.  If not, see <http://www.gnu.org/licenses/>.
 */

package org.boreas.web;


import org.boreas.mongodb.MongoStorage;
import org.boreas.web.handler.GetHandler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;


/**
 * Web Layer for Thermostat that handles http requests from the client to the storage backend (mongodb) through REST API
 */
public class WebLayer {
    public void start() {
        MongoStorage storage = new MongoStorage("thermostat", 27518);
        storage.start();

        Server server = new Server();

        ServerConnector http = new ServerConnector(server);
        http.setHost("localhost");
        http.setPort(8080);
        http.setIdleTimeout(30000);

        server.addConnector(http);

        server.setHandler(new GetHandler(storage.getDB()));

        try {
            server.start();
            server.join();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            storage.finish();
            server.destroy();
        }
    }
}
