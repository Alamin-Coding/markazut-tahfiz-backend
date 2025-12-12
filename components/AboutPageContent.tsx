"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { CloudinaryImageUpload } from "./CloudinaryImageUpload";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";

interface IAboutData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  mission: {
    title: string;
    content: string;
  };
  vision: {
    title: string;
    content: string;
  };
  history: {
    title: string;
    paragraphs: string[];
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
  }>;
  programs: Array<{
    title: string;
    duration: string;
    description: string;
  }>;
  values: Array<{
    title: string;
    description: string;
  }>;
  facilities: Array<{
    title: string;
    description: string;
  }>;
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

const defaultData: IAboutData = {
  hero: { title: "আমাদের সম্পর্কে", subtitle: "মারকাজুত তাহফীজ ইন্সটিটিউশনাল মাদরাসার ইতিহাস ও মিশন", backgroundImage: "" },
  mission: { title: "মিশন:", content: "ইসলামী শিক্ষার মাধ্যমে দেশের যুব সমাজকে সুশিক্ষিত..." },
  vision: { title: "ভিশন:", content: "একটি বিশ্বমানের শিক্ষা প্রতিষ্ঠান..." },
  history: { title: "প্রতিষ্ঠানের ইতিহাস", paragraphs: ["মারকাজুত তাহফীজ ইন্সটিটিউশনাল মাদরাসা..."] },
  features: [],
  achievements: [],
  programs: [],
  values: [],
  facilities: [],
  cta: { title: "আমাদের সাথে যোগ দিন", description: "আপনার সন্তানের সর্বোত্তম ভবিষ্যতের জন্য...", buttonText: "এখনই ভর্তি আবেদন করুন" },
};

export default function AboutPageContent({ uploadToCloudinary }: { uploadToCloudinary: (file: File, folder?: string) => Promise<any> }) {
  const [data, setData] = useState<IAboutData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await fetch("/api/about");
      const json = await res.json();
      if (json.success && json.data && Object.keys(json.data).length > 0) {
        // Merge with default to ensure all fields exist
        const mergedData = { ...defaultData, ...json.data };
        // Ensure arrays are arrays
        mergedData.history.paragraphs = mergedData.history.paragraphs || [];
        mergedData.features = mergedData.features || [];
        mergedData.achievements = mergedData.achievements || [];
        mergedData.programs = mergedData.programs || [];
        mergedData.values = mergedData.values || [];
        mergedData.facilities = mergedData.facilities || [];
        
        setData(mergedData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Changes saved successfully");
      } else {
        toast.error(json.message || "Failed to save");
      }
    } catch (error) {
      toast.error("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  const update = (section: keyof IAboutData, field: string | null, value: any, index: number | null = null, subfield: string | null = null) => {
    setData(prev => {
      const newData = { ...prev };
      if (index !== null) {
        // Check if we are updating a nested array (e.g. history.paragraphs)
        // If field exists and the section[field] is an array, we target that.
        const sectionData = newData[section] as any;
        if (field && Array.isArray(sectionData[field])) {
            const arr = [...sectionData[field]];
            if (subfield) {
                arr[index] = { ...arr[index], [subfield]: value };
            } else {
                arr[index] = value;
            }
            (newData as any)[section] = { ...sectionData, [field]: arr };
        } else if (Array.isArray(sectionData)) {
            // Direct array update
            const arr = [...sectionData];
            if (subfield) {
                arr[index] = { ...arr[index], [subfield]: value };
            } else {
                arr[index] = value;
            }
            (newData as any)[section] = arr;
        }
      } else if (field) {
        // Object field update
        (newData as any)[section] = { ...(newData as any)[section], [field]: value };
      }
      return newData;
    });
  };

  const addArrayItem = (section: keyof IAboutData, item: any, subKey?: string) => {
    setData(prev => {
        if (subKey) {
             const sectionObj = prev[section] as any;
             return {
                 ...prev,
                 [section]: {
                     ...sectionObj,
                     [subKey]: [...(sectionObj[subKey] || []), item]
                 }
             };
        }
        return {
            ...prev,
            [section]: [...(prev[section] as any[]), item]
        };
    });
  };

  const removeArrayItem = (section: keyof IAboutData, index: number, subKey?: string) => {
    setData(prev => {
        if (subKey) {
             const sectionObj = prev[section] as any;
             return {
                 ...prev,
                 [section]: {
                     ...sectionObj,
                     [subKey]: (sectionObj[subKey] as any[]).filter((_, i) => i !== index)
                 }
             };
        }
        return {
            ...prev,
            [section]: (prev[section] as any[]).filter((_, i) => i !== index)
        };
    });
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8 text-green-600" /></div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center bg-white p-4 sticky top-0 z-10 shadow-sm rounded-md">
        <h1 className="text-2xl font-bold text-gray-800">আমাদের সম্পর্কে পেজ এডিটর</h1>
        <Button onClick={() => handleSave()} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
          {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          সেভ করুন
        </Button>
      </div>

      {/* Hero */}
      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">হিরো সেকশন</h2>
        <div className="space-y-2">
          <Label>শিরোনাম</Label>
          <Input value={data.hero.title} onChange={e => update("hero", "title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>সাবটাইটেল</Label>
          <Input value={data.hero.subtitle} onChange={e => update("hero", "subtitle", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>ব্যাকগ্রাউন্ড ছবি</Label>
          <CloudinaryImageUpload 
            label="ছবি আপলোড করুন"
            folder="markazut-tahfiz/about"
            value={data.hero.backgroundImage}
            onChange={(url) => update("hero", "backgroundImage", url)}
            uploadToCloudinary={uploadToCloudinary}
          />
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">মিশন ও ভিশন</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-lg font-medium text-green-600">মিশন</Label>
            <div className="space-y-2">
                <Label>টাইটেল</Label>
                <Input value={data.mission.title} onChange={e => update("mission", "title", e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label>বর্ণনা</Label>
                <Textarea rows={2} value={data.mission.content} onChange={e => update("mission", "content", e.target.value)} />
            </div>
          </div>
          <div className="space-y-4">
            <Label className="text-lg font-medium text-green-600">ভিশন</Label>
            <div className="space-y-2">
                <Label>টাইটেল</Label>
                <Input value={data.vision.title} onChange={e => update("vision", "title", e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label>বর্ণনা</Label>
                <Textarea rows={2} value={data.vision.content} onChange={e => update("vision", "content", e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">প্রতিষ্ঠানের ইতিহাস</h2>
        <div className="space-y-3">
             {data.history.paragraphs.map((p, i) => (
                 <div key={i} className="flex gap-2 items-start">
                     <Textarea className="min-h-[50px]" value={p} onChange={e => update("history", "paragraphs", e.target.value, i)} placeholder={`প্যারাগ্রাফ ${i + 1}`} />
                     <Button variant="destructive" size="icon" onClick={() => removeArrayItem("history", i, "paragraphs")}><Trash2 className="w-4 h-4" /></Button>
                 </div>
             ))}
             <Button variant="outline" size="sm" onClick={() => addArrayItem("history", "", "paragraphs")}><Plus className="w-4 h-4 mr-2" /> প্যারাগ্রাফ যোগ করুন</Button>
        </div>
      </div>

       {/* Features */}
       <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">আমাদের বৈশিষ্ট্য</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.features.map((item, i) => (
                <div key={i} className="border p-4 rounded-md space-y-3 relative">
                     <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeArrayItem("features", i)}><Trash2 className="w-3 h-3" /></Button>
                     <div className="space-y-2">
                        <Label>আইকন (URL)</Label>
                        <CloudinaryImageUpload 
                            label="আইকন আপলোড"
                            folder="markazut-tahfiz/features"
                            value={item.icon}
                            onChange={(url) => update("features", null, url, i, "icon")}
                            uploadToCloudinary={uploadToCloudinary}
                        />
                     </div>
                     <Input placeholder="টাইটেল" value={item.title} onChange={e => update("features", null, e.target.value, i, "title")} />
                     <Textarea placeholder="বর্ণনা" value={item.description} onChange={e => update("features", null, e.target.value, i, "description")} />
                </div>
            ))}
        </div>
        <Button variant="outline" onClick={() => addArrayItem("features", { title: "", description: "", icon: "" })}><Plus className="w-4 h-4 mr-2" /> বৈশিষ্ট্য যোগ করুন</Button>
      </div>



      {/* Achievements */}
      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">আমাদের অর্জন</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.achievements.map((item, i) => (
                <div key={i} className="border p-4 rounded-md space-y-2 relative">
                    <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-6 w-6 text-red-500" onClick={() => removeArrayItem("achievements", i)}><Trash2 className="w-3 h-3" /></Button>
                    <Label>সংখ্যা (১৫+)</Label>
                    <Input value={item.title} onChange={e => update("achievements", null, e.target.value, i, "title")} />
                    <Label>লেবেল (বছরের অভিজ্ঞতা)</Label>
                    <Input value={item.description} onChange={e => update("achievements", null, e.target.value, i, "description")} />
                </div>
            ))}
        </div>
        <Button variant="outline" onClick={() => addArrayItem("achievements", { title: "", description: "" })}><Plus className="w-4 h-4 mr-2" /> অর্জন যোগ করুন</Button>
      </div>
      
       {/* Programs */}
       <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">শিক্ষা কর্মসূচি</h2>
        <div className="grid md:grid-cols-2 gap-4">
            {data.programs.map((item, i) => (
                <div key={i} className="border p-4 rounded-md space-y-2 relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-500" onClick={() => removeArrayItem("programs", i)}><Trash2 className="w-3 h-3" /></Button>
                    <Input placeholder="প্রোগ্রাম নাম" value={item.title} onChange={e => update("programs", null, e.target.value, i, "title")} className="font-bold" />
                    <Input placeholder="সময়কাল (৩ বছর)" value={item.duration} onChange={e => update("programs", null, e.target.value, i, "duration")} />
                    <Textarea placeholder="বর্ণনা" value={item.description} onChange={e => update("programs", null, e.target.value, i, "description")} />
                </div>
            ))}
        </div>
        <Button variant="outline" onClick={() => addArrayItem("programs", { title: "", duration: "", description: "" })}><Plus className="w-4 h-4 mr-2" /> প্রোগ্রাম যোগ করুন</Button>
      </div>

      {/* Values */}
      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">আমাদের মূল্যবোধ</h2>
        <div className="grid md:grid-cols-2 gap-4">
            {data.values.map((item, i) => (
                <div key={i} className="border p-4 rounded-md space-y-2 relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-500" onClick={() => removeArrayItem("values", i)}><Trash2 className="w-3 h-3" /></Button>
                    <Input placeholder="মূল্যবোধ" value={item.title} onChange={e => update("values", null, e.target.value, i, "title")} className="font-bold" />
                    <Textarea placeholder="বর্ণনা" value={item.description} onChange={e => update("values", null, e.target.value, i, "description")} />
                </div>
            ))}
        </div>
        <Button variant="outline" onClick={() => addArrayItem("values", { title: "", description: "" })}><Plus className="w-4 h-4 mr-2" /> মূল্যবোধ যোগ করুন</Button>
      </div>

      {/* Facilities - Dynamic as requested */}
      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-green-700">আমাদের সুবিধাসমূহ (Facilities)</h2>
        <div className="grid md:grid-cols-2 gap-4">
            {data.facilities.map((item, i) => (
                <div key={i} className="border p-4 rounded-md flex gap-3 items-start bg-gray-50">
                     <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold mt-1">✓</div>
                     <div className="flex-1 space-y-2">
                        <Input placeholder="সুবিধার নাম" value={item.title} onChange={e => update("facilities", null, e.target.value, i, "title")} className="font-bold border-green-200 focus:border-green-500" />
                        <Textarea placeholder="বিস্তারিত বর্ণনা" value={item.description} onChange={e => update("facilities", null, e.target.value, i, "description")} className="text-sm" rows={2} />
                     </div>
                     <Button variant="destructive" size="icon" onClick={() => removeArrayItem("facilities", i)}><Trash2 className="w-4 h-4" /></Button>
                </div>
            ))}
        </div>
        <Button variant="outline" onClick={() => addArrayItem("facilities", { title: "", description: "" })} className="w-full border-green-200 hover:bg-green-50 text-green-700"><Plus className="w-4 h-4 mr-2" /> নতুন সুবিধা যোগ করুন</Button>
      </div>

      {/* CTA */}
      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">কল টু অ্যাকশন</h2>
        <div className="space-y-2">
          <Label>টাইটেল</Label>
          <Input value={data.cta.title} onChange={e => update("cta", "title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>বর্ণনা</Label>
          <Textarea value={data.cta.description} onChange={e => update("cta", "description", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>বাটন টেক্সট</Label>
          <Input value={data.cta.buttonText} onChange={e => update("cta", "buttonText", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

