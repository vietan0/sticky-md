import * as Tooltip from '@radix-ui/react-tooltip';

interface Props { content: string; asChild?: boolean; children: JSX.Element }

export default function TooltipWrapper({ content, asChild = false, children }: Props) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild={asChild}>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 rounded-sm bg-black/75 px-2 py-1 text-xs text-white dark:bg-black/90 dark:outline-solid dark:outline-1 dark:outline-white/30"
            side="bottom"
            sideOffset={5}
          >
            {content}
            <Tooltip.Arrow className="fill-black/75 dark:stroke-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
