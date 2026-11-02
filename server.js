import express from 'express';
const app = express();
app.use(express.json());

const listings = [
    { id: 1, title: "Nile View apartment", pricepernight: 85 },
    { id: 2, title: "Beach House", pricepernight: 140 },
    { id: 3, title: "Desert Eco-Lodge", pricepernight: 60 },
];
let nextId = listings.length + 1;

function getListings() {
    return listings;
}

function getListingById(id) {
    return listings.find(listing => listing.id === id);
}

function addListing(data) {
    const listing = {
        id: nextId++,
        title: data.title,
        pricepernight: data.pricepernight,
    };
    listings.push(listing);
    return listing;
}

function updateListing(id, data) {
    const listing = getListingById(id);
    if (listing) {
        listing.title = data.title;
        listing.pricepernight = data.pricepernight;
    }
    return listing;
}

function removeListing(id) {
    const index = listings.findIndex(listing => listing.id === id);
    if (index !== -1) {
        listings.splice(index, 1);
        return true;
    }
    return false;
}

function handleGetAll(req, res) {
    res.json(getListings());
}

function handleGetOne(req, res) {
    const listing = getListingById(Number(req.params.id));
    if (!listing) {
        return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
}

function handleCreate(req, res) {
    const data = req.body || {};
    if (!data.title || data.pricepernight == null) {
        return res.status(400).json({ error: 'title and pricepernight are required' });
    }
    res.status(201).json(addListing(data));
}

function handleUpdate(req, res) {
    const data = req.body || {};
    if (!data.title || data.pricepernight == null) {
        return res.status(400).json({ error: 'title and pricepernight are required' });
    }
    const listing = updateListing(Number(req.params.id), data);
    if (!listing) {
        return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
}

function handleDelete(req, res) {
    const removed = removeListing(Number(req.params.id));
    if (!removed) {
        return res.status(404).json({ error: 'Listing not found' });
    }
    res.status(204).end();
}

app.get("/", (req, res) => {
    res.send("Welcome to ebd bn'b");
});

app.get("/api/listings", handleGetAll);
app.get("/api/listings/:id", handleGetOne);
app.post("/api/listings", handleCreate);
app.put("/api/listings/:id", handleUpdate);
app.delete("/api/listings/:id", handleDelete);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
