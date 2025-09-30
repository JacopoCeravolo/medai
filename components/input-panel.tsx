"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "./ui/input";
import { MultimodalInput } from "./multimodal-input";
import { useState } from "react";
import type { AppUsage } from "@/lib/usage";

export function InputPanel() {
  const [input, setInput] = useState<string>("");
  const [usage, setUsage] = useState<AppUsage | undefined>(undefined);
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Input</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Panel</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex-1 flex flex-col p-4 pt-0">
        <div className="flex-1 flex items-center justify-center bg-muted/50 rounded-xl">
          <div className="w-[80%] max-w-4xl p-6">
            <MultimodalInput
              chatId="chat-123"
              input={input}
              setInput={setInput}
              stop={() => {}}
              attachments={[]}
              setAttachments={() => {}}
              messages={[]}
              setMessages={() => {}}
              /* sendMessage={() => {}} */
              className=""
              selectedModelId=""
              onModelChange={() => {}}
              usage={usage}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
