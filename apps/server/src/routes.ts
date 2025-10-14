import { getAuth } from "@clerk/express";
import {
  addContact,
  deleteContact,
  getContact,
  getMyContacts,
  seedContacts,
  updateContact,
} from "@contacts/server/queries";
import { UpdateContactSchema } from "@contacts/server/validation";
import express, { type Request, type Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    const contacts = await getMyContacts(userId!, req.query.q as string);
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

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    const validatedFields = UpdateContactSchema.safeParse(req.body);

    if (!validatedFields.success) {
      res.status(403).json({
        message: "Failed to create contact.",
        errors: validatedFields.error.flatten().fieldErrors,
      });
      return;
    }

    const contact = await addContact(userId!, validatedFields.data);
    res.status(201).json({ contact });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create contact.",
    });
  }
});

router.post("/seed", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    const contacts = await seedContacts(userId!);
    res.status(201).json({ contacts });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create contact.",
    });
  }
});

router.get("/:contactId", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    const contact = await getContact(userId!, req.params.contactId);

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

router.put("/:contactId", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    const validatedFields = UpdateContactSchema.safeParse(req.body);

    if (!validatedFields.success) {
      res.status(403).json({
        message: "Failed to update contact details.",
        errors: validatedFields.error.flatten().fieldErrors,
      });
      return;
    }

    const contact = await updateContact(userId!, req.params.contactId, validatedFields.data);
    res.json({ contact });
  } catch (error) {
    console.error(error);

    res.status(404).json({
      message: "Failed to update contact details.",
    });
    return;
  }
});

router.delete("/:contactId", async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    await deleteContact(userId!, req.params.contactId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete contact.",
    });
  }
});

export default router;
