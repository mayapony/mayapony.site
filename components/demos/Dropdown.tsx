"use client";

import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { PostContent } from "../post/PostContent";

export const Dropdown = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownMenuOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      className="flex h-72 w-full min-w-[300px] flex-col items-center rounded-md bg-ctp-crust pt-10 sm:w-1/2 md:w-1/3"
      ref={dropdownRef}
    >
      <DropdownMenu.Root
        open={isDropdownMenuOpen}
        onOpenChange={setIsDropdownOpen}
      >
        <DropdownMenu.Trigger>
          <Avatar.Root>
            <Avatar.Image
              src="https://avatars.githubusercontent.com/u/62200137?s=400&u=b0b4c85eb6ebcbc0ce6557191979633186908f8e&v=4"
              className="h-16 w-16 rounded-full"
            />
            <Avatar.Fallback delayMs={600}>avatar</Avatar.Fallback>
          </Avatar.Root>
        </DropdownMenu.Trigger>

        <AnimatePresence>
          {isDropdownMenuOpen && (
            <DropdownMenu.Portal forceMount>
              <DropdownMenu.Content sideOffset={5} align="start">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="min-w-[120px] origin-top-left rounded-md bg-gray-100/70 p-2 text-ctp-text/90 backdrop-blur-md"
                >
                  <DropdownMenu.Item className="my-1">
                    查看个人信息
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="my-1">
                    修改个人信息
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="my-1">
                    修改密码
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-gray-300" />
                  <DropdownMenu.Item className="mt-2 text-red-600">
                    退出
                  </DropdownMenu.Item>
                  <DropdownMenu.Arrow className="fill-gray-100/70" />
                </motion.div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          )}
        </AnimatePresence>
      </DropdownMenu.Root>

      <div className="w-full p-4">
        <PostContent
          content="
        一个带有动画的下拉菜单，使用了 ==Radix UI== 和 ==Framer Motion==。
        <br />
        <br />
        **笔记：使用 transform-origin 改变动画开始的方向**
        "
        />
      </div>
    </div>
  );
};
