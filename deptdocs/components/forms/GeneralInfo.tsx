"use client";

import React from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

const ACTIVITY_TYPES = [
    "Seminar", "Workshop", "Conference", "Technical Talk", "Guest Talk",
    "Industry Visit", "Sports", "Cultural Competition", "Technical fest/ Academic fests",
    "CAADS", "Research Clubs / or any other Clubs", "Newsletter", "Alumni",
    "Faculty Development Program", "Quality Improvement Program", "Refresher Course",
    "MoU", "Outreach Activity", "International Event"
];

const SUB_CATEGORIES = [
    "Competitive Exams", "Career Guidance", "Skill Development",
    "Communication Skills", "Women Event", "Emerging Trends and Technology",
    "Life Skills", "Soft Skills", "Others"
];

export default function GeneralInfo({ data, onUpdate, onNext }: any) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h3 className="text-xl font-bold text-[#1a365d] border-b-2 border-[#1a365d] inline-block pb-1">
                General Information
            </h3>

            <div className="space-y-6">
                {/* Title of the Activity */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Title of the Activity</label>
                    <input
                        type="text"
                        value={data.activityTitle || ''}
                        onChange={(e) => onUpdate({ activityTitle: e.target.value })}
                        placeholder="Enter title"
                        className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#3b5998] outline-none transition-all"
                    />
                </div>

                {/* Type of Activity Dropdown */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Type of Activity</label>
                    <select
                        value={data.activityType || ''}
                        onChange={(e) => onUpdate({ activityType: e.target.value })}
                        className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#3b5998] appearance-none cursor-pointer"
                    >
                        <option value="">Select Activity Type</option>
                        {ACTIVITY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>

                {/* Sub Category Dropdown */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Sub Category</label>
                    <select
                        value={data.subCategory || ''}
                        onChange={(e) => onUpdate({ subCategory: e.target.value })}
                        className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#3b5998] appearance-none cursor-pointer"
                    >
                        <option value="">Select Sub Category</option>
                        {SUB_CATEGORIES.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-8 pt-2">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Start Date</label>
                            <div className="flex items-center border rounded-lg bg-gray-50 p-3">
                                <input
                                    type="date"
                                    className="bg-transparent w-full outline-none text-sm"
                                    value={data.date || ''}
                                    onChange={(e) => onUpdate({ date: e.target.value })}
                                />
                                <Calendar size={16} className="text-gray-400" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Start Time</label>
                            <div className="flex items-center border rounded-lg bg-gray-50 p-3">
                                <input
                                    type="time"
                                    className="bg-transparent w-full outline-none text-sm"
                                    value={data.time || ''}
                                    onChange={(e) => onUpdate({ time: e.target.value })}
                                />
                                <Clock size={16} className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">End Date</label>
                            <div className="flex items-center border rounded-lg bg-gray-50 p-3">
                                <input
                                    type="date"
                                    className="bg-transparent w-full outline-none text-sm"
                                    value={data.endDate || ''}
                                    onChange={(e) => onUpdate({ endDate: e.target.value })}
                                />
                                <Calendar size={16} className="text-gray-400" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">End Time</label>
                            <div className="flex items-center border rounded-lg bg-gray-50 p-3">
                                <input
                                    type="time"
                                    className="bg-transparent w-full outline-none text-sm"
                                    value={data.endTime || ''}
                                    onChange={(e) => onUpdate({ endTime: e.target.value })}
                                />
                                <Clock size={16} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Venue */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Venue</label>
                    <input
                        type="text"
                        value={data.venue || ''}
                        onChange={(e) => onUpdate({ venue: e.target.value })}
                        placeholder="e.g. Panel Room, Block IV"
                        className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#3b5998]"
                    />
                </div>

                {/* Collaboration/Sponsor */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Collaboration/ Sponsor</label>
                    <input
                        type="text"
                        value={data.collaboration || ''}
                        onChange={(e) => onUpdate({ collaboration: e.target.value })}
                        placeholder="e.g. Tech Corp / Research Labs"
                        className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#3b5998]"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={onNext}
                    className="bg-[#3b5998] text-white px-10 py-2.5 rounded-lg font-bold flex items-center space-x-2 hover:bg-[#2d4373] transition-all"
                >
                    <span>Next</span>
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}