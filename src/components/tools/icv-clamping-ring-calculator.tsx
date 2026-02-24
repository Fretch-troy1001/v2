import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../ui/dialog";
import { cn } from "../../lib/utils";
import { Loader2, PenTool, ArrowLeft } from "lucide-react";

export function IcvClampingRingCalculator() {
  const [casingId, setCasingId] = useState("");
  const [valveLockOd, setValveLockOd] = useState("");
  const [roughWeldingThickness, setRoughWeldingThickness] = useState("4.00");
  const [loading, setLoading] = useState(false);
  const [responseHtml, setResponseHtml] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/submit-icv-clamping-ring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ casingId, valveLockOd, roughWeldingThickness }),
      });

      if (response.ok) {
        const data = await response.json();
        let content = data.data;
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].output) {
            content = parsed[0].output;
          } else if (parsed.output) {
            content = parsed.output;
          }
        } catch (e) { /* use raw text */ }

        // Strip markdown code blocks if the webhook returns them
        content = content.replace(/^```html\s*/, '').replace(/\s*```$/, '');
        
        setResponseHtml(content);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit data");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResponseHtml(null);
    setCasingId("");
    setValveLockOd("");
    setRoughWeldingThickness("4.00");
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <div className="tool-card group cursor-pointer">
          <div className="tool-card__header">
            <div className="tool-card__icon text-[var(--accent)]">
              <PenTool className="w-5 h-5" />
            </div>
            <span className="tag tag--success">Active</span>
          </div>
          <div className="tool-card__title group-hover:text-[var(--accent)] transition-colors">ICV Clamping Ring Final Dimensions Calculator</div>
          <div className="tool-card__desc">Calculate final dimensions for ICV clamping ring.</div>
          <div className="tool-card__footer">
            <div><span className="tag tag--amber">Machining</span></div>
            <button className="btn btn--primary">Open Tool</button>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ICV Clamping Ring Final Dimensions</DialogTitle>
          <DialogDescription>
            {responseHtml ? "Calculation Results" : "Enter dimensions for Casing ID and ValveLock OD."}
          </DialogDescription>
        </DialogHeader>

        {responseHtml ? (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: responseHtml }} />
            </div>
            <button
              onClick={resetForm}
              className="flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Calculate another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="casingId">Casing ID (Plane M)</Label>
              <Input
                id="casingId"
                placeholder="Enter Casing ID"
                value={casingId}
                onChange={(e) => setCasingId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valveLockOd">ValveLock OD (Plane G)</Label>
              <Input
                id="valveLockOd"
                placeholder="Enter ValveLock OD"
                value={valveLockOd}
                onChange={(e) => setValveLockOd(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roughWeldingThickness">Rough Welding Thickness</Label>
              <Input
                id="roughWeldingThickness"
                placeholder="Enter Rough Welding Thickness"
                value={roughWeldingThickness}
                onChange={(e) => setRoughWeldingThickness(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-[var(--danger)] bg-[var(--danger-soft)] rounded-md border border-[var(--danger)]/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                "bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 shadow-sm"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Calculate Dimensions"
              )}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
