-- Drop tables if they exits to allow clean restarts during development
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS events;

-- Create the events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_tickets INTEGER NOT NULL CHECK (total_tickets >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the reservations table
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    reservation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert a mock event for testing purposes
INSERT INTO events (name, total_tickets, available_tickets)
VALUES ('Tech Conference 2026', 100, 100);