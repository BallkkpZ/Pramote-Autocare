export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
        <p className="text-muted-foreground">กำลังโหลด...</p>
      </div>
    </div>
  );
}
