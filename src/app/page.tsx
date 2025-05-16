import { Paper } from "@/components";

export default function Home() {
  return (
    <main className="my-6 flex items-center justify-center gap-8 h-full w-full">
      <Paper className="p-4">
        <p className="text-center text-lg">Welcome to the Video Studio!</p>
        <p className="text-center">
          To get the most out of this app, please check out the video editor.
        </p>
      </Paper>
    </main>
  );
}
