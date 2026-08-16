import prisma from "../prisma/prismaClient.js";

const VALID_FEEDBACK_TYPES = new Set(["PROBLEM", "IDEA", "OTHER"]);

const VALID_FEEDBACK_AREAS = new Set([
  "DASHBOARD",
  "ADD_RECIPE",
  "IMPORT_RECIPE",
  "BROWSE_RECIPES",
  "RECIPE_DETAILS",
  "EDIT_RECIPE",
  "COOKING_MODE",
  "FAVORITES",
  "FOLDERS",
  "REMINDERS",
  "OTHER",
]);

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalText(value, maximumLength) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  return normalized.slice(0, maximumLength);
}

function normalizeViewportValue(value) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 10000) {
    return null;
  }

  return parsed;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function createFeedback(req, res) {
  try {
    const type = normalizeText(req.body.type).toUpperCase();
    const area = normalizeText(req.body.area).toUpperCase();
    const summary = normalizeText(req.body.summary);
    const details = normalizeText(req.body.details);
    const submittedByName = normalizeText(req.body.submittedByName);
    const contactEmail = normalizeText(req.body.contactEmail);

    if (!VALID_FEEDBACK_TYPES.has(type)) {
      return res.status(400).json({
        error: "Select a valid feedback type",
      });
    }

    if (!VALID_FEEDBACK_AREAS.has(area)) {
      return res.status(400).json({
        error: "Select where this feedback applies",
      });
    }

    if (!summary) {
      return res.status(400).json({
        error: "A short summary is required",
      });
    }

    if (summary.length > 120) {
      return res.status(400).json({
        error: "Summary must be 120 characters or fewer",
      });
    }

    if (!details) {
      return res.status(400).json({
        error: "Feedback details are required",
      });
    }

    if (details.length > 5000) {
      return res.status(400).json({
        error: "Feedback details must be 5,000 characters or fewer",
      });
    }

    if (!submittedByName) {
      return res.status(400).json({
        error: "Your name is required",
      });
    }

    if (submittedByName.length > 80) {
      return res.status(400).json({
        error: "Name must be 80 characters or fewer",
      });
    }

    if (contactEmail && contactEmail.length > 254) {
      return res.status(400).json({
        error: "Email address is too long",
      });
    }

    if (contactEmail && !isValidEmail(contactEmail)) {
      return res.status(400).json({
        error: "Enter a valid email address",
      });
    }

    const feedback = await prisma.feedback.create({
      data: {
        type,
        area,
        summary,
        details,
        submittedByName,
        contactEmail: contactEmail || null,
        pagePath: normalizeOptionalText(req.body.pagePath, 500),
        userAgent: normalizeOptionalText(req.body.userAgent, 500),
        viewportWidth: normalizeViewportValue(req.body.viewportWidth),
        viewportHeight: normalizeViewportValue(req.body.viewportHeight),
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Thank you! Your feedback has been submitted.",
      feedback,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);

    return res.status(500).json({
      error: "Failed to submit feedback",
    });
  }
}
