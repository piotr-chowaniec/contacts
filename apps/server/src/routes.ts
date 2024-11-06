import { AuthObject } from "@clerk/express";
import express, { Request, Response } from "express";

import {
  addContact,
  deleteContact,
  getContact,
  getMyContacts,
  seedContacts,
  updateContact,
} from "@contacts/server/queries";
import { UpdateContactSchema } from "@contacts/server/validation";

const router = express.Router();

type AuthenticatedRequest = Request & { auth?: AuthObject };

router.get("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.auth!.userId!;

    const contacts = await getMyContacts(userId, req.query.q as string);
    res.json({
      contacts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch contacts.",
    });
  }
});

router.post("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.auth!.userId!;

    const validatedFields = UpdateContactSchema.safeParse(req.body);

    if (!validatedFields.success) {
      res.status(403).json({
        message: "Failed to create contact.",
        errors: validatedFields.error.flatten().fieldErrors,
      });
      return;
    }

    const contact = await addContact(userId, validatedFields.data);
    res.status(201).json({ contact });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create contact.",
    });
  }
});

router.post("/seed", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.auth!.userId!;

    const contacts = await seedContacts(userId);
    res.status(201).json({ contacts });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create contact.",
    });
  }
});

router.get("/:contactId", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.auth!.userId!;

    const contact = await getContact(userId, req.params.contactId);

    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }

    res.json({ contact });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch contact details.",
    });
  }
});

router.put("/:contactId", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.auth!.userId!;

    const validatedFields = UpdateContactSchema.safeParse(req.body);

    if (!validatedFields.success) {
      res.status(403).json({
        message: "Failed to update contact details.",
        errors: validatedFields.error.flatten().fieldErrors,
      });
      return;
    }

    const contact = await updateContact(userId, req.params.contactId, validatedFields.data);
    res.json({ contact });
  } catch (error) {
    console.error(error);

    res.status(404).json({
      message: "Failed to update contact details.",
    });
    return;
  }
});

router.delete("/:contactId", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.auth!.userId!;

    await deleteContact(userId, req.params.contactId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete contact.",
    });
  }
});

export default router;
