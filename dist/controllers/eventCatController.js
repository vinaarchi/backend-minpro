"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCategoryController = void 0;
const prisma_1 = require("../config/prisma");
class EventCategoryController {
    //create a new event category
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description } = req.body;
            if (!name) {
                return res.status(400).json({ error: "Name is required" });
            }
            try {
                const category = yield prisma_1.prisma.eventCategory.create({
                    data: { name, description },
                });
                res.status(201).json(category);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to create event category" });
            }
        });
    }
    //get all event categories
    getAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield prisma_1.prisma.eventCategory.findMany();
                res.status(200).json(categories);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to fetch event categories" });
            }
        });
    }
    //get a single category by id
    getCategoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid ID format" });
            }
            try {
                const category = yield prisma_1.prisma.eventCategory.findUnique({
                    where: { id },
                });
                if (!category) {
                    return res.status(404).json({ error: "Event category not found" });
                }
                res.status(200).json(category);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to fetch event category" });
            }
        });
    }
    //update an event category
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            const { name, description } = req.body;
            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid ID format" });
            }
            try {
                const category = yield prisma_1.prisma.eventCategory.findUnique({
                    where: { id },
                });
                if (!category) {
                    return res.status(404).json({ error: "Event category not found" });
                }
                const updatedCategory = yield prisma_1.prisma.eventCategory.update({
                    where: { id },
                    data: Object.assign(Object.assign({}, (name !== undefined && { name })), (description !== undefined && { description })),
                });
                res.status(200).json(updatedCategory);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to update event category" });
            }
        });
    }
    //delete an event category
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid ID format" });
            }
            try {
                const category = yield prisma_1.prisma.eventCategory.findUnique({
                    where: { id },
                });
                if (!category) {
                    return res.status(404).json({ error: "Event category not found" });
                }
                yield prisma_1.prisma.eventCategory.delete({
                    where: { id },
                });
                res.status(200).json({ message: "Event category deleted successfully" });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to delete event category" });
            }
        });
    }
}
exports.EventCategoryController = EventCategoryController;
