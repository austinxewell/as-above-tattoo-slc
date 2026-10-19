import { Link } from "react-router";
import { Check } from "lucide-react";
import type { ProfileTask } from "~/lib/dashboard";

export function ProfileChecklist({ tasks }: { tasks: ProfileTask[] }) {
  if (tasks.length === 0) return null;

  const doneCount = tasks.filter((task) => task.done).length;

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        <span className="text-foreground tabular-nums">
          {doneCount} of {tasks.length}
        </span>{" "}
        done
      </p>
      <div aria-hidden="true" className="mt-2 h-1 bg-surface-raised">
        <div
          className="h-full bg-accent"
          style={{ width: `${(doneCount / tasks.length) * 100}%` }}
        />
      </div>

      <ul className="mt-4 grid gap-2.5">
        {tasks.map((task) => (
          <li key={task.label}>
            {task.done ? (
              <span className="flex items-start gap-2.5 text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                <span className="mt-0.5 grid size-4 shrink-0 place-items-center bg-accent text-accent-foreground">
                  <Check className="size-3" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span>
                  {task.label}
                  <span className="sr-only"> (done)</span>
                </span>
              </span>
            ) : (
              <Link to={task.to} className="group flex items-start gap-2.5 text-sm">
                <span aria-hidden="true" className="mt-0.5 size-4 shrink-0 border border-accent" />
                <span className="border-b border-transparent transition-colors group-hover:border-accent">
                  {task.label}
                </span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
