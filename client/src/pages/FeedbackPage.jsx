import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Textarea from "../components/common/Textarea";
import { createFeedback } from "../api/feedback";

const feedbackTypeOptions = [
  {
    value: "PROBLEM",
    label: "Problem",
  },
  {
    value: "IDEA",
    label: "Idea",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

const feedbackAreaOptions = [
  { value: "", label: "Choose a section" },
  { value: "DASHBOARD", label: "Dashboard" },
  { value: "ADD_RECIPE", label: "Add Recipe" },
  { value: "IMPORT_RECIPE", label: "Import Recipe" },
  { value: "BROWSE_RECIPES", label: "Browse Recipes" },
  { value: "RECIPE_DETAILS", label: "Recipe Details" },
  { value: "EDIT_RECIPE", label: "Edit Recipe" },
  { value: "COOKING_MODE", label: "Cooking Mode" },
  { value: "FAVORITES", label: "Favorites" },
  { value: "FOLDERS", label: "Folders" },
  { value: "REMINDERS", label: "Reminders" },
  { value: "OTHER", label: "Another Area" },
];

function createInitialFormData() {
  return {
    type: "PROBLEM",
    area: "",
    summary: "",
    details: "",
    submittedByName: "",
    contactEmail: "",
  };
}

function getDetailsContent(type) {
  if (type === "IDEA") {
    return {
      label: "Tell us about your idea",
      placeholder:
        "What would you like RecipeVault to do, and how would it improve your cooking workflow?",
    };
  }

  if (type === "OTHER") {
    return {
      label: "Tell us more",
      placeholder:
        "Share anything else you would like us to know about RecipeVault.",
    };
  }

  return {
    label: "What happened?",
    placeholder:
      "What were you trying to do? What happened, and what did you expect to happen?",
  };
}

export default function FeedbackPage() {
  const [formData, setFormData] = useState(
    createInitialFormData,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [submissionMessage, setSubmissionMessage] =
    useState("");
  const [error, setError] = useState("");

  const detailsContent = getDetailsContent(formData.type);

  const isFormValid =
    formData.type &&
    formData.area &&
    formData.summary.trim() &&
    formData.summary.trim().length <= 120 &&
    formData.details.trim() &&
    formData.details.trim().length <= 5000 &&
    formData.submittedByName.trim() &&
    formData.submittedByName.trim().length <= 80;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function handleTypeChange(type) {
    setFormData((previousFormData) => ({
      ...previousFormData,
      type,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isFormValid || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await createFeedback({
        type: formData.type,
        area: formData.area,
        summary: formData.summary.trim(),
        details: formData.details.trim(),
        submittedByName:
          formData.submittedByName.trim(),
        contactEmail:
          formData.contactEmail.trim() || null,
        pagePath: window.location.pathname,
        userAgent: window.navigator.userAgent,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });

      setSubmissionMessage(
        response.message ||
          "Thank you! Your feedback has been submitted.",
      );
      setFormData(createInitialFormData());
      setDidSubmit(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setError(
        err.message || "Failed to submit feedback",
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSendAnother() {
    setDidSubmit(false);
    setSubmissionMessage("");
    setError("");
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-5 pb-8 sm:space-y-6">
      <PageHeader
        title="Feedback"
        description="Found a problem or have an idea? Tell us about it."
        backTo="/dashboard"
        backLabel="Back to Dashboard"
      />

      {didSubmit ? (
        <Card className="border-rv-teal/40 bg-white/95">
          <div
            className="space-y-5 text-center"
            role="status"
            aria-live="polite"
          >
            <div
              aria-hidden="true"
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-rv-teal/40 bg-rv-teal/20 text-xl font-bold text-rv-plum"
            >
              ✓
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-rv-plum">
                Feedback received
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                {submissionMessage}
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                onClick={handleSendAnother}
                fullWidth
              >
                Send More Feedback
              </Button>

              <Link
                to="/dashboard"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-rv-plum transition hover:bg-stone-50"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {error ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm"
            >
              {error}
            </div>
          ) : null}

          <Card className="border-stone-300/70 bg-white/95">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              aria-busy={isSubmitting}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
                  Share Feedback
                </p>

                <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-950">
                  What would you like us to know?
                </h2>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Choose the type of feedback and where it
                  happened.
                </p>
              </div>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-stone-700">
                  Feedback Type
                </legend>

                <div className="grid grid-cols-3 gap-2">
                  {feedbackTypeOptions.map((option) => {
                    const isSelected =
                      formData.type === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          handleTypeChange(option.value)
                        }
                        aria-pressed={isSelected}
                        className={`min-h-11 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                          isSelected
                            ? "border-rv-plum bg-rv-plum text-white"
                            : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-stone-700">
                  RecipeVault Area
                </span>

                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none transition hover:border-stone-400 focus:border-rv-plum focus:ring-2 focus:ring-rv-plum/10 sm:text-sm"
                >
                  {feedbackAreaOptions.map((option) => (
                    <option
                      key={option.value || "empty"}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="space-y-2">
                <Input
                  label="Short Summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder={
                    formData.type === "IDEA"
                      ? "Ex: Add recipe sharing"
                      : "Ex: Timer resets when I leave Cooking Mode"
                  }
                />

                <p
                  className={`text-right text-xs ${
                    formData.summary.length > 120
                      ? "font-semibold text-red-600"
                      : "text-stone-400"
                  }`}
                >
                  {formData.summary.length}/120
                </p>
              </div>

              <div className="space-y-2">
                <Textarea
                  label={detailsContent.label}
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder={detailsContent.placeholder}
                  rows={6}
                />

                <p
                  className={`text-right text-xs ${
                    formData.details.length > 5000
                      ? "font-semibold text-red-600"
                      : "text-stone-400"
                  }`}
                >
                  {formData.details.length}/5000
                </p>
              </div>

              <div className="border-t border-stone-200 pt-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rv-plum/60">
                    About You
                  </p>

                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    Add your name so we know who submitted the
                    feedback. Email is optional.
                  </p>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Your Name"
                    name="submittedByName"
                    value={formData.submittedByName}
                    onChange={handleChange}
                    placeholder="Your name"
                  />

                  <Input
                    label="Email (Optional)"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3">
                <p className="text-xs leading-5 text-stone-500">
                  To help investigate problems, RecipeVault will
                  include your screen size, browser information,
                  and the current page with this submission.
                </p>
              </div>

              <Button
                type="submit"
                disabled={!isFormValid}
                isLoading={isSubmitting}
                fullWidth
              >
                {isSubmitting
                  ? "Sending Feedback..."
                  : "Send Feedback"}
              </Button>
            </form>
          </Card>
        </>
      )}
    </section>
  );
}