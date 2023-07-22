import * as Tooltip from '@radix-ui/react-tooltip';

type Props = { content: string; children: JSX.Element };
export default function TooltipWrapper({ content, children }: Props) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="bottom"
            sideOffset={5}
            className="rounded bg-black/75 px-2 py-1 text-xs text-white dark:bg-black/90 dark:outline dark:outline-1 dark:outline-white/30"
          >
            {content}
            <Tooltip.Arrow className="fill-black/75 dark:stroke-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
