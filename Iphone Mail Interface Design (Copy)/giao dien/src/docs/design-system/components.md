# Components Library
## Liquid Glass iOS 26 Design System

---

## Table of Contents
1. [Screen Container](#screen-container)
2. [Headers](#headers)
3. [Cards & Surfaces](#cards--surfaces)
4. [Lists](#lists)
5. [Buttons](#buttons)
6. [Inputs](#inputs)
7. [Modals](#modals)
8. [Avatars](#avatars)
9. [Tags & Badges](#tags--badges)
10. [Comments](#comments)
11. [Progress Indicators](#progress-indicators)

---

## Screen Container

### Base Screen Template
Full-screen component with liquid glass background.

```tsx
import { ChevronLeft } from "lucide-react";

interface ScreenProps {
  onBack?: () => void;
}

export default function Screen({ onBack }: ScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-md mx-auto relative overflow-hidden">
      {/* Liquid Glass Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-100/30 to-purple-100/30 backdrop-blur-3xl"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

### Centered Content Screen
For dialogs or selection screens.

```tsx
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-md mx-auto relative overflow-hidden">
  {/* Background layers... */}
  
  <div className="relative z-10 min-h-screen flex items-center justify-center">
    <div className="w-full">
      {/* Centered content */}
    </div>
  </div>
</div>
```

---

## Headers

### Navigation Header
Standard header with back button, title, and action.

```tsx
<div className="bg-white/70 backdrop-blur-2xl border-b border-gray-200/50 px-4 py-3">
  <div className="flex items-center justify-between">
    <button
      onClick={onBack}
      className="w-8 h-8 flex items-center justify-center active:bg-gray-200/50 rounded-full transition-colors"
    >
      <ChevronLeft className="w-6 h-6 text-[#007AFF]" />
    </button>
    <div className="text-[17px] text-black">Page Title</div>
    <button className="text-[17px] text-[#007AFF]">
      Done
    </button>
  </div>
</div>
```

**Variants:**

```tsx
// With close button
<button className="w-8 h-8 flex items-center justify-center active:bg-gray-200/50 rounded-full transition-colors">
  <X className="w-5 h-5 text-[#007AFF]" />
</button>

// With more menu
<button className="w-8 h-8 flex items-center justify-center active:bg-gray-200/50 rounded-full transition-colors">
  <MoreHorizontal className="w-5 h-5 text-[#007AFF]" />
</button>

// Centered title only
<div className="px-4 py-3">
  <div className="flex items-center justify-center">
    <h2 className="text-[17px] text-black">Title</h2>
  </div>
</div>

// With disabled action
<button
  disabled={!canSave}
  className={`text-[17px] ${canSave ? 'text-[#007AFF]' : 'text-gray-400'}`}
>
  Save
</button>
```

---

## Cards & Surfaces

### Primary Glass Card
Main container for content.

```tsx
<div className="bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40">
  {/* Content */}
</div>
```

### Secondary Glass Card
For nested or less prominent content.

```tsx
<div className="bg-white/20 backdrop-blur-xl rounded-[20px] shadow-lg shadow-black/5 border border-white/30">
  {/* Content */}
</div>
```

### Content Card
Card with padding.

```tsx
<div className="bg-white/30 backdrop-blur-xl rounded-[20px] p-4 shadow-xl shadow-black/5 border border-white/40">
  <h2 className="text-[20px] text-black mb-2">Card Title</h2>
  <p className="text-[15px] text-gray-600">Card description text</p>
</div>
```

### Info Card Row
Displays label-value pairs with icons.

```tsx
<div className="bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40">
  {/* Row 1 */}
  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200/50">
    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
      <Calendar className="w-4 h-4 text-[#007AFF]" />
    </div>
    <div className="flex-1">
      <div className="text-[13px] text-gray-500">Due Date</div>
      <div className="text-[15px] text-black">Oct 25, 2025</div>
    </div>
  </div>
  
  {/* Row 2 */}
  <div className="flex items-center gap-3 px-4 py-3">
    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
      <Users className="w-4 h-4 text-purple-600" />
    </div>
    <div className="flex-1">
      <div className="text-[13px] text-gray-500">Assignees</div>
      {/* Avatars or content */}
    </div>
  </div>
</div>
```

---

## Lists

### List Container
Container for list items.

```tsx
<div className="bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40">
  {items.map((item, index) => (
    <ListItem key={item.id} isLast={index === items.length - 1} />
  ))}
</div>
```

### Basic List Item
Standard list item with avatar and text.

```tsx
<div className="flex items-center gap-3 px-4 py-3 active:bg-white/20 transition-colors border-b border-gray-200/50 last:border-b-0">
  {/* Avatar */}
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
    <span className="text-white text-[17px]">NA</span>
  </div>
  
  {/* Content */}
  <div className="flex-1 min-w-0">
    <div className="text-[15px] text-black">Primary Text</div>
    <div className="text-[13px] text-gray-500 truncate">Secondary text or description</div>
  </div>
  
  {/* Right element (optional) */}
  <div className="flex-shrink-0">
    {/* Badge, arrow, or action */}
  </div>
</div>
```

### Selectable List Item
With checkbox/checkmark.

```tsx
<div
  onClick={() => toggleSelection(item.id)}
  className="flex items-center gap-3 px-4 py-3 active:bg-white/20 transition-colors border-b border-gray-200/50 last:border-b-0 cursor-pointer"
>
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
    <span className="text-white text-[17px]">NA</span>
  </div>
  
  <div className="flex-1 min-w-0">
    <div className="text-[15px] text-black">User Name</div>
    <div className="text-[13px] text-gray-500 truncate">user@email.com</div>
  </div>
  
  {selected && (
    <div className="w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center flex-shrink-0">
      <Check className="w-4 h-4 text-white" strokeWidth={3} />
    </div>
  )}
</div>
```

### Interactive List Item
With icon and arrow.

```tsx
<button className="w-full flex items-center gap-3 px-4 py-3 active:bg-white/20 transition-colors border-b border-gray-200/50 last:border-b-0">
  <Calendar className="w-5 h-5 text-[#007AFF]" />
  <span className="flex-1 text-left text-[15px] text-black">Due Date</span>
  <span className="text-[15px] text-gray-500">Not set</span>
</button>
```

### Checklist Item
Toggle between checked/unchecked.

```tsx
<div
  onClick={() => toggleItem(item.id)}
  className="flex items-center gap-3 px-4 py-3 active:bg-white/20 transition-colors cursor-pointer border-b border-gray-200/50 last:border-b-0"
>
  {item.completed ? (
    <CheckCircle2 className="w-6 h-6 text-[#007AFF] flex-shrink-0" />
  ) : (
    <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
  )}
  <span className={`flex-1 text-[15px] ${
    item.completed ? 'text-gray-400 line-through' : 'text-black'
  }`}>
    {item.title}
  </span>
</div>
```

---

## Buttons

### Primary Button
Main action button.

```tsx
<button className="px-16 h-12 bg-[#007AFF] text-white rounded-xl active:scale-98 transition-all shadow-lg shadow-blue-500/30">
  <span className="text-[17px]">Continue</span>
</button>
```

### Disabled Primary Button
```tsx
<button
  disabled={!canProceed}
  className={`px-16 h-12 rounded-xl transition-all ${
    canProceed 
      ? "bg-[#007AFF] text-white active:scale-98 shadow-lg shadow-blue-500/30 cursor-pointer" 
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>
  <span className="text-[17px]">Confirm</span>
</button>
```

### Secondary Button
Glass-style button.

```tsx
<button className="px-4 py-3 bg-white/30 backdrop-blur-xl rounded-[20px] text-[15px] text-black border border-white/40 active:bg-white/40 transition-colors">
  Secondary Action
</button>
```

### Destructive Button
For delete actions.

```tsx
<button className="w-full bg-red-500/20 backdrop-blur-xl rounded-[20px] px-4 py-3 flex items-center justify-center gap-2 active:bg-red-500/30 transition-colors shadow-xl shadow-black/5 border border-red-300/40">
  <Trash2 className="w-5 h-5 text-red-600" />
  <span className="text-[15px] text-red-600">Delete Task</span>
</button>
```

### Icon Button
Circular button for navigation.

```tsx
<button className="w-8 h-8 flex items-center justify-center active:bg-gray-200/50 rounded-full transition-colors">
  <X className="w-5 h-5 text-[#007AFF]" />
</button>
```

### Send Button
For comment/message submission.

```tsx
<button
  onClick={sendMessage}
  disabled={!message.trim()}
  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
    message.trim()
      ? 'bg-[#007AFF] text-white active:scale-95'
      : 'bg-gray-200 text-gray-400'
  }`}
>
  <Send className="w-5 h-5" />
</button>
```

---

## Inputs

### Text Input
Single-line text field.

```tsx
<div className="bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40">
  <input
    type="text"
    placeholder="Enter title"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    className="w-full px-4 py-4 bg-transparent text-[17px] text-black placeholder:text-gray-400 outline-none"
  />
</div>
```

### Textarea
Multi-line text field.

```tsx
<div className="bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40">
  <textarea
    placeholder="Add description..."
    value={value}
    onChange={(e) => setValue(e.target.value)}
    rows={4}
    className="w-full px-4 py-4 bg-transparent text-[15px] text-black placeholder:text-gray-400 outline-none resize-none"
  />
</div>
```

### Comment Input
Rounded pill-style input.

```tsx
<div className="flex items-center gap-3">
  <input
    type="text"
    placeholder="Write a comment..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    onKeyPress={(e) => e.key === 'Enter' && submit()}
    className="flex-1 bg-gray-100/50 rounded-full px-4 py-2 text-[15px] text-black placeholder:text-gray-400 outline-none"
  />
  <button className="w-9 h-9 rounded-full bg-[#007AFF] text-white flex items-center justify-center">
    <Send className="w-5 h-5" />
  </button>
</div>
```

### Add Item Input
For checklists.

```tsx
<div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200/50">
  <Plus className="w-6 h-6 text-[#007AFF] flex-shrink-0" />
  <input
    type="text"
    placeholder="Add new item..."
    value={newItem}
    onChange={(e) => setNewItem(e.target.value)}
    onKeyPress={(e) => e.key === 'Enter' && addItem()}
    className="flex-1 bg-transparent text-[15px] text-black placeholder:text-gray-400 outline-none"
  />
</div>
```

---

## Modals

### Alert Dialog
Simple confirmation or info modal.

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Backdrop */}
  <div
    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
    onClick={onClose}
  ></div>

  {/* Modal */}
  <div className="relative bg-white/90 backdrop-blur-2xl rounded-[20px] w-full max-w-sm overflow-hidden shadow-2xl border border-white/50">
    {/* Content */}
    <div className="p-6 text-center">
      <h3 className="text-[17px] text-black mb-2">Alert Title</h3>
      <p className="text-[13px] text-gray-600">
        Alert message or description goes here.
      </p>
    </div>

    {/* Actions */}
    <div className="border-t border-gray-200/50">
      <button
        onClick={onConfirm}
        className="w-full px-4 py-3 text-[17px] text-[#007AFF] active:bg-gray-100/50 transition-colors"
      >
        OK
      </button>
    </div>
  </div>
</div>
```

### Confirmation Dialog
With two action buttons.

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel}></div>
  
  <div className="relative bg-white/90 backdrop-blur-2xl rounded-[20px] w-full max-w-sm overflow-hidden shadow-2xl border border-white/50">
    <div className="p-6 text-center">
      <h3 className="text-[17px] text-black mb-2">Delete Task</h3>
      <p className="text-[13px] text-gray-600">
        Are you sure? This action cannot be undone.
      </p>
    </div>
    
    <div className="border-t border-gray-200/50">
      <div className="grid grid-cols-2">
        <button
          onClick={onCancel}
          className="px-4 py-3 text-[17px] text-[#007AFF] active:bg-gray-100/50 transition-colors border-r border-gray-200/50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-3 text-[17px] text-red-600 active:bg-gray-100/50 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</div>
```

### Action Sheet
Multiple action options.

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel}></div>
  
  <div className="relative bg-white/90 backdrop-blur-2xl rounded-[20px] w-full max-w-sm overflow-hidden shadow-2xl border border-white/50">
    <div className="p-6 text-center">
      <h3 className="text-[17px] text-black mb-2">Save Changes</h3>
      <p className="text-[13px] text-gray-600">
        Do you want to save your changes?
      </p>
    </div>
    
    <div className="border-t border-gray-200/50">
      <button className="w-full px-4 py-3 text-[17px] text-[#007AFF] active:bg-gray-100/50 transition-colors border-b border-gray-200/50">
        Save
      </button>
      <button className="w-full px-4 py-3 text-[17px] text-red-600 active:bg-gray-100/50 transition-colors border-b border-gray-200/50">
        Don't Save
      </button>
      <button className="w-full px-4 py-3 text-[17px] text-gray-600 active:bg-gray-100/50 transition-colors">
        Cancel
      </button>
    </div>
  </div>
</div>
```

---

## Avatars

### Single Avatar
```tsx
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
  <span className="text-white text-[17px]">NA</span>
</div>
```

### Avatar Sizes
```tsx
// Small (replies)
<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
  <span className="text-white text-[12px]">NA</span>
</div>

// Medium (comments)
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
  <span className="text-white text-[14px]">NA</span>
</div>

// Large (lists)
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
  <span className="text-white text-[17px]">NA</span>
</div>
```

### Stacked Avatars
```tsx
<div className="flex -space-x-2">
  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[12px] border-2 border-white">NA</div>
  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-[12px] border-2 border-white">TB</div>
  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-[12px] border-2 border-white">LC</div>
</div>
```

---

## Tags & Badges

### Basic Tag
```tsx
<span className="px-2 py-1 bg-blue-500/20 text-blue-700 text-[12px] rounded-full">
  Design
</span>
```

### Multiple Tags
```tsx
<div className="flex gap-2 flex-wrap">
  <span className="px-2 py-1 bg-blue-500/20 text-blue-700 text-[12px] rounded-full">Design</span>
  <span className="px-2 py-1 bg-purple-500/20 text-purple-700 text-[12px] rounded-full">UI/UX</span>
  <span className="px-2 py-1 bg-pink-500/20 text-pink-700 text-[12px] rounded-full">Urgent</span>
</div>
```

### Count Badge
```tsx
<div className="relative">
  <MessageCircle className="w-5 h-5 text-[#007AFF]" />
  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
    <span className="text-[10px] text-white">3</span>
  </div>
</div>
```

---

## Comments

### Comment Card
```tsx
<div className="bg-white/30 backdrop-blur-xl rounded-[20px] p-4 shadow-xl shadow-black/5 border border-white/40">
  {/* Author */}
  <div className="flex items-start gap-3 mb-3">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
      <span className="text-white text-[14px]">NA</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[15px] text-black">Nguyễn Văn An</div>
      <div className="text-[13px] text-gray-500">2 giờ trước</div>
    </div>
  </div>
  
  {/* Comment */}
  <p className="text-[15px] text-gray-800 mb-3 ml-13">
    This is a comment with some meaningful content.
  </p>
  
  {/* Actions */}
  <div className="flex items-center gap-4 ml-13">
    <button className="flex items-center gap-1.5 active:scale-95 transition-transform">
      <Heart className="w-5 h-5 text-gray-500" />
      <span className="text-[13px] text-gray-500">5</span>
    </button>
    <button className="flex items-center gap-1.5 text-gray-500 active:scale-95 transition-transform">
      <Reply className="w-5 h-5" />
      <span className="text-[13px]">Reply</span>
    </button>
  </div>
</div>
```

### Reply Card
```tsx
<div className="ml-6 mt-3">
  <div className="bg-white/20 backdrop-blur-xl rounded-[20px] p-4 shadow-lg shadow-black/5 border border-white/30">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-sm">
        <span className="text-white text-[12px]">TB</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] text-black">Trần Thị Bình</div>
        <div className="text-[12px] text-gray-500">1 giờ trước</div>
      </div>
    </div>
    
    <p className="text-[14px] text-gray-800 mb-2 ml-11">
      This is a reply to the comment above.
    </p>
    
    <div className="flex items-center gap-4 ml-11">
      <button className="flex items-center gap-1.5 active:scale-95 transition-transform">
        <Heart className="w-4 h-4 text-gray-500" />
        <span className="text-[12px] text-gray-500">2</span>
      </button>
    </div>
  </div>
</div>
```

### Like Button
```tsx
<button
  onClick={toggleLike}
  className="flex items-center gap-1.5 active:scale-95 transition-transform"
>
  <Heart
    className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
  />
  <span className={`text-[13px] ${liked ? 'text-red-500' : 'text-gray-500'}`}>
    {likeCount}
  </span>
</button>
```

---

## Progress Indicators

### Progress Bar
```tsx
<div className="bg-white/30 backdrop-blur-xl rounded-[20px] p-4 shadow-xl shadow-black/5 border border-white/40">
  <div className="flex items-center justify-between mb-2">
    <span className="text-[15px] text-black">Progress</span>
    <span className="text-[15px] text-gray-600">3/5</span>
  </div>
  <div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
      style={{ width: `${(3/5) * 100}%` }}
    ></div>
  </div>
</div>
```

### Circular Progress (Simple)
```tsx
<div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#007AFF] animate-spin"></div>
```

---

**Last Updated:** 2025-10-20
