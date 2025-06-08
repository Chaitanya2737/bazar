import { Button } from "@/components/ui/button";

export function ConfirmModal({ open, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-lg">
        <p className="text-gray-900 dark:text-gray-100 mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-gray-700 dark:text-gray-300"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
