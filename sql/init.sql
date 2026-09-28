-- Create database
CREATE DATABASE PushNotificationsDb;
GO

USE PushNotificationsDb;
GO

-- Create Order table with Category
CREATE TABLE Orders (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    CustomerName NVARCHAR(200) NULL,
    CreatedAt DATETIME2 NOT NULL,
    Category NVARCHAR(50) NOT NULL  -- New field for food type
);

-- Create Notification table with Category
CREATE TABLE Notifications (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Title NVARCHAR(200) NULL,
    Message NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL,
    IsRead BIT NOT NULL DEFAULT 0,
    Payload NVARCHAR(200) NULL,
    Category NVARCHAR(50) NOT NULL  -- New field for food type
);

-- Optional: Insert some sample categories
INSERT INTO Orders (Id, CustomerName, CreatedAt, Category)
VALUES
(NEWID(), 'Alice', GETUTCDATE(), 'Bakery'),
(NEWID(), 'Bob', GETUTCDATE(), 'Coffee'),
(NEWID(), 'Charlie', GETUTCDATE(), 'Lunch'),
(NEWID(), 'David', GETUTCDATE(), 'Snacks');

INSERT INTO Notifications (Id, Title, Message, CreatedAt, IsRead, Payload, Category)
VALUES
(NEWID(), 'New Bakery Order', 'Order from Alice', GETUTCDATE(), 0, NULL, 'Bakery'),
(NEWID(), 'New Coffee Order', 'Order from Bob', GETUTCDATE(), 0, NULL, 'Coffee'),
(NEWID(), 'New Lunch Order', 'Order from Charlie', GETUTCDATE(), 0, NULL, 'Lunch'),
(NEWID(), 'New Snacks Order', 'Order from David', GETUTCDATE(), 0, NULL, 'Snacks');

