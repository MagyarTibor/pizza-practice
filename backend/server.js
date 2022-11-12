const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json()); // IMPORTANT
