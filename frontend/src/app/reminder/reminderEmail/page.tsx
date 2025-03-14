"use client";
import React, { useState, useRef } from "react";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ModeToggle";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { IoIosSend, IoMdAttach, IoMdImage } from "react-icons/io";
import { IoLink } from "react-icons/io5";
import {
    MdOutlineColorLens, MdOutlineLock, MdEmojiEmotions, MdDraw, MdFormatBold, MdFormatItalic,
    MdFormatUnderlined, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight,
    MdFormatListBulleted, MdFormatListNumbered, MdFormatIndentIncrease, MdFormatIndentDecrease,
    MdSubscript, MdSuperscript, MdTableChart, MdHorizontalRule
} from "react-icons/md";
import SearchBar from '@/components/globalSearch';
import Notification from '@/components/notification';

const EmailInput: React.FC = () => {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [confidential, setConfidential] = useState(false);
    const [showTextFormatting, setShowTextFormatting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);
    const [showTablePicker, setShowTablePicker] = useState(false);
    const [selectedRows, setSelectedRows] = useState(0);
    const [selectedCols, setSelectedCols] = useState(0);
    const [attachments, setAttachments] = useState<File[]>([]);

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setAttachments([...attachments, ...Array.from(files)]);
            const messageDiv = messageRef.current;
            if (messageDiv) {
                Array.from(files).forEach((file) => {
                    messageDiv.innerHTML += `<p><i>${file.name}</i></p>`;
                });
            }
        }
    };

    const handleSendEmail = async () => {
        const message = messageRef.current?.innerText || ""; 

        const formData = new FormData();
        formData.append("to", to);
        formData.append("subject", subject);
        formData.append("message", message);

        attachments.forEach((file) => {
            formData.append("attachments[]", file);
        });

        try {
            const response = await fetch('http://localhost:8000/api/v1/invoice/sendEmailReminder', {                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email. Please try again.");
        }
    };

    const applyFormatting = (command: string, value?: string | boolean) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (!selectedText) return; 

        const span = document.createElement("span");

        switch (command) {
            case "bold":
                span.style.fontWeight = "bold";
                break;
            case "italic":
                span.style.fontStyle = "italic";
                break;
            case "underline":
                span.style.textDecoration = "underline";
                break;
            case "foreColor":
                span.style.color = value as string;
                break;
            case "justifyLeft":
                (range.commonAncestorContainer.parentNode as HTMLElement).style.textAlign = "left";
                return;
            case "justifyCenter":
                (range.commonAncestorContainer.parentNode as HTMLElement).style.textAlign = "center";
                return;
            case "justifyRight":
                (range.commonAncestorContainer.parentNode as HTMLElement).style.textAlign = "right";
                return;
            case "insertOrderedList":
                document.execCommand("insertOrderedList", false);
                return;
            case "insertUnorderedList":
                document.execCommand("insertUnorderedList", false);
                return;
            case "indent":
                document.execCommand("indent", false);
                return;
            case "outdent":
                document.execCommand("outdent", false);
                return;
            case "subscript":
                span.style.verticalAlign = "sub";
                span.style.fontSize = "smaller";
                break;
            case "superscript":
                span.style.verticalAlign = "super";
                span.style.fontSize = "smaller";
                break;
            default:
                return;
        }

        span.textContent = selectedText;
        range.deleteContents();
        range.insertNode(span);
        selection.removeAllRanges();
    };

    const applyFontStyle = (property: "fontFamily" | "fontSize", value: string) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const span = document.createElement("span");

        if (property === "fontFamily") {
            span.style.fontFamily = value;
        } else if (property === "fontSize") {
            span.style.fontSize = `${value}px`; 
        }

        span.appendChild(range.extractContents()); 
    };

    const insertTable = () => {
        const messageDiv = messageRef.current;
        if (!messageDiv) return;

        let tableHTML = `<table style="width: 100%; border-collapse: collapse; border: 1px solid black;">`;

        for (let i = 0; i < selectedRows; i++) {
            tableHTML += "<tr>";
            for (let j = 0; j < selectedCols; j++) {
                tableHTML += `<td style="border: 1px solid black; padding: 8px;"></td>`;
            }
            tableHTML += "</tr>";
        }

        tableHTML += "</table><br/>";
        messageDiv.innerHTML += tableHTML;

        setShowTablePicker(false);
    };

    const insertHorizontalLine = () => {
        const messageDiv = messageRef.current;
        if (messageDiv) {
            const hr = document.createElement("hr");
            hr.style.margin = "10px 0"; 
            messageDiv.appendChild(hr);
        }
    };


    return (
        <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <ModeToggle />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center space-x-4 ml-auto mr-4">
        <div  >
                <SearchBar/>
            </div>
            <div>
              <Notification/>
            </div>
        </div>
      </header>

                {showTablePicker && (
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                        onClick={() => setShowTablePicker(false)} 
                    >
                        <div
                            className="bg-white shadow-md p-4 border rounded-md"
                            onClick={(e) => e.stopPropagation()} 
                        >
                            <div className="grid grid-cols-6 gap-1">
                                {[...Array(6)].map((_, row) =>
                                    [...Array(6)].map((_, col) => (
                                        <div
                                            key={`${row}-${col}`}
                                            className={`w-8 h-8 border ${row < selectedRows && col < selectedCols ? "bg-blue-300" : "bg-gray-100"}`}
                                            onMouseEnter={() => {
                                                setSelectedRows(row + 1);
                                                setSelectedCols(col + 1);
                                            }}
                                            onClick={insertTable}
                                        />
                                    ))
                                )}
                            </div>
                            <p className="text-center mt-2 text-sm">Size: {selectedRows} × {selectedCols}</p>
                        </div>
                    </div>
                )}
                <div className="p-6 w-full max-w-lg mx-auto">
                    <Card className="border border-gray-300 shadow-md rounded-lg">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-lg font-semibold">New Message</h2>
                            <Separator className="my-2 border-gray-300" />

                            <div className="flex items-center space-x-4">
                                <label className="text-sm font-medium w-20">To:</label>
                                <Input
                                    type="email"
                                    placeholder="Recipient's email"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <label className="text-sm font-medium w-20">Subject:</label>
                                <Input
                                    type="text"
                                    placeholder="Subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>   
                            <div
                                ref={messageRef}
                                className="border border-gray-300 rounded-md h-40 p-2 overflow-y-auto"
                                contentEditable
                                style={{ maxHeight: "200px", minHeight: "100px", whiteSpace: "pre-wrap" }}
                            />


                            <div className="flex flex-wrap items-center gap-2 border border-gray-300 p-2 rounded-md">
                                <IoMdAttach className="text-xl cursor-pointer hover:text-gray-500" onClick={handleFileClick} />

                                <select className="border p-1 rounded-md text-sm" onChange={(e) => applyFontStyle("fontFamily", e.target.value)}>
                                    <option value="Arial">Arial</option>
                                    <option value="Verdana">Verdana</option>
                                    <option value="Times New Roman">Times New Roman</option>
                                    <option value="Courier New">Courier New</option>
                                    <option value="Georgia">Georgia</option>
                                </select>

                                <select className="border p-1 rounded-md text-sm" onChange={(e) => applyFontStyle("fontSize", e.target.value)}>
                                    <option value="10">10</option>
                                    <option value="12">12</option>
                                    <option value="14">14</option>
                                    <option value="16">16</option>
                                    <option value="18">18</option>
                                    <option value="20">20</option>
                                    <option value="24">24</option>

                                </select>

                                <Button variant="outline" onClick={() => applyFormatting("bold")}><MdFormatBold /></Button>
                                <Button variant="outline" onClick={() => applyFormatting("italic")}><MdFormatItalic /></Button>
                                <Button variant="outline" onClick={() => applyFormatting("underline")}><MdFormatUnderlined /></Button>

                                <a className="flex items-center space-x-1 cursor-pointer">
                                    <span className="font-bold text-lg">A</span>
                                    <input
                                        type="color"
                                        className="w-8 h-8 border-none cursor-pointer"
                                        onChange={(e) => applyFormatting("foreColor", e.target.value)}
                                    />
                                </a>

                                <Button variant="outline" onClick={() => applyFormatting("justifyLeft")}><MdFormatAlignLeft /></Button>
                                <Button variant="outline" onClick={() => applyFormatting("justifyCenter")}><MdFormatAlignCenter /></Button>
                                <Button variant="outline" onClick={() => applyFormatting("justifyRight")}><MdFormatAlignRight /></Button>
                                <Button variant="outline" onClick={() => applyFormatting("indent")}><MdFormatIndentIncrease /></Button>
                                <Button variant="outline" onClick={() => applyFormatting("outdent")}><MdFormatIndentDecrease /></Button>
                                <Button variant="outline" onClick={() => applyFormatting("subscript")}><MdSubscript /></Button>
                                <Button variant="outline" onClick={() => applyFormatting("superscript")}><MdSuperscript /></Button>
                                <Button variant="outline" onClick={() => setShowTablePicker(true)} ><MdTableChart /></Button>
                                <Button variant="outline" onClick={insertHorizontalLine}>
                                    <MdHorizontalRule />
                                </Button>

                            </div>

                            <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />

                            <Button className="flex items-center space-x-2" onClick={handleSendEmail}>
                                <IoIosSend className="text-lg" />
                                <span>Send</span>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                </SidebarInset>
        </SidebarProvider>
    );
};

export default EmailInput;
