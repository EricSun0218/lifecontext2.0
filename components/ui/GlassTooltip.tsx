import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface GlassTooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export const GlassTooltip: React.FC<GlassTooltipProps> = ({ children, content, side = "top", align = "center" }) => {
  return (
    <Tooltip.Provider delayDuration={200} skipDelayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side={side}
            align={align}
            sideOffset={8}
            className="z-[100] px-3 py-1.5 text-xs font-medium text-white bg-[#0f0c29]/90 backdrop-blur-md border border-blue-400/20 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-200 select-none"
          >
            {content}
            <Tooltip.Arrow className="fill-[#0f0c29]/90 border-t border-l border-blue-400/20" width={10} height={5} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
