# AI Prompt Template
## For Creating New Components in Liquid Glass iOS 26 Style

---

## 📋 Sử dụng Template này

Khi bạn muốn tạo component mới hoặc bắt đầu dự án tương tự, **copy toàn bộ nội dung bên dưới** và gửi cho AI (ChatGPT, Claude, v.v.) kèm theo yêu cầu cụ thể của bạn.

---

## 🎨 DESIGN SYSTEM REFERENCE

Tôi đang làm việc với một Design System có phong cách **iOS 26 Liquid Glass Effect**. Hãy tuân thủ CHÍNH XÁC các quy tắc sau:

---

### 1. LIQUID GLASS BACKGROUND (BẮT BUỘC)

Mọi màn hình phải có background pattern này:

```tsx
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 max-w-md mx-auto relative overflow-hidden">
  {/* Liquid Glass Background Effect */}
  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-100/30 to-purple-100/30 backdrop-blur-3xl"></div>
  <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
  <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>

  {/* Content */}
  <div className="relative z-10">
    {/* Nội dung chính */}
  </div>
</div>
```

---

### 2. GLASS SURFACE PATTERN (BẮT BUỘC)

Tất cả cards, containers phải dùng glass effect:

```tsx
// Primary Surface (dùng cho hầu hết các card)
<div className="bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40">
  {/* Content */}
</div>

// Header Surface (solid hơn)
<div className="bg-white/70 backdrop-blur-2xl border-b border-gray-200/50 px-4 py-3">
  {/* Header content */}
</div>

// Modal Surface (gần như solid)
<div className="bg-white/90 backdrop-blur-2xl rounded-[20px] shadow-2xl border border-white/50">
  {/* Modal content */}
</div>

// Secondary/Nested Surface (nhạt hơn)
<div className="bg-white/20 backdrop-blur-xl rounded-[20px] shadow-lg shadow-black/5 border border-white/30">
  {/* Nested content */}
</div>
```

---

### 3. TYPOGRAPHY RULES (NGHIÊM NGẶT)

**QUAN TRỌNG**: Sử dụng CHÍNH XÁC các font sizes sau (iOS standards):

```tsx
text-[20px]  // Large titles
text-[17px]  // Headers, page titles, buttons
text-[15px]  // Body text, list items
text-[14px]  // Secondary content in replies
text-[13px]  // Captions, metadata, timestamps
text-[12px]  // Small labels, tags
```

**Text Colors:**
```tsx
text-black       // Primary text
text-gray-800    // Secondary text
text-gray-500    // Tertiary text (metadata)
text-gray-400    // Disabled/placeholder
text-[#007AFF]   // Links và actions (iOS Blue)
text-red-600     // Destructive actions
```

**KHÔNG BAO GIỜ sử dụng:**
- `text-lg`, `text-xl`, `text-sm` (dùng pixel values thay thế)
- Font weights khác `font-normal` hoặc `font-medium`

---

### 4. COLOR SYSTEM

#### Primary Color
```tsx
#007AFF  // iOS Blue - dùng cho tất cả primary actions
```

#### Avatar Gradients
```tsx
const AVATAR_COLORS = {
  blue: "bg-gradient-to-br from-blue-400 to-blue-600",
  pink: "bg-gradient-to-br from-pink-400 to-pink-600",
  purple: "bg-gradient-to-br from-purple-400 to-purple-600",
  green: "bg-gradient-to-br from-green-400 to-green-600",
  orange: "bg-gradient-to-br from-orange-400 to-orange-600",
}
```

#### Tag/Badge Colors
```tsx
bg-blue-500/20 text-blue-700
bg-purple-500/20 text-purple-700
bg-pink-500/20 text-pink-700
bg-green-500/20 text-green-700
bg-red-500/20 text-red-600    // For destructive tags
```

#### Icon Circle Backgrounds
```tsx
bg-blue-500/10   // For Calendar, Users
bg-purple-500/10 // For Tags
bg-pink-500/10   // For Messages
bg-orange-500/10 // For Priority
bg-red-500/10    // For Delete
bg-green-500/10  // For Success
```

---

### 5. SPACING SYSTEM

**Padding:**
```tsx
px-4 py-3  // List items, buttons
px-4 py-4  // Input fields
p-4        // Card content
p-6        // Modal content
```

**Gaps:**
```tsx
gap-3      // Default gap between elements
gap-2      // Tight spacing
gap-4      // Larger spacing
space-y-4  // Vertical stacks
```

**Margins:**
```tsx
mb-2       // Small margin
mb-3       // Medium margin
mb-6       // Large margin
ml-6       // Indent for nested items (1.5rem)
ml-11      // Indent for comment text (2.75rem)
ml-13      // Indent after avatar (3.25rem)
```

---

### 6. BORDER RADIUS

```tsx
rounded-full      // Avatars, circular buttons
rounded-[20px]    // Primary cards and containers (ƯU TIÊN DÙNG)
rounded-xl        // Buttons, smaller elements
```

---

### 7. COMPONENT PATTERNS

#### Navigation Header
```tsx
<div className="bg-white/70 backdrop-blur-2xl border-b border-gray-200/50 px-4 py-3">
  <div className="flex items-center justify-between">
    <button className="w-8 h-8 flex items-center justify-center active:bg-gray-200/50 rounded-full transition-colors">
      <ChevronLeft className="w-6 h-6 text-[#007AFF]" />
    </button>
    <div className="text-[17px] text-black">Title</div>
    <button className="text-[17px] text-[#007AFF]">Action</button>
  </div>
</div>
```

#### List Item
```tsx
<div className="flex items-center gap-3 px-4 py-3 active:bg-white/20 transition-colors border-b border-gray-200/50 last:border-b-0">
  {/* Icon/Avatar */}
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
    <span className="text-white text-[17px]">NA</span>
  </div>
  
  {/* Content */}
  <div className="flex-1 min-w-0">
    <div className="text-[15px] text-black">Primary Text</div>
    <div className="text-[13px] text-gray-500 truncate">Secondary Text</div>
  </div>
  
  {/* Right Element */}
  <div className="flex-shrink-0">
    {/* Actions or indicators */}
  </div>
</div>
```

#### Primary Button
```tsx
<button className="px-16 h-12 bg-[#007AFF] text-white rounded-xl active:scale-98 transition-all shadow-lg shadow-blue-500/30">
  <span className="text-[17px]">Button Text</span>
</button>
```

#### Disabled Button
```tsx
<button 
  disabled
  className="px-16 h-12 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed"
>
  <span className="text-[17px]">Disabled</span>
</button>
```

#### Icon Button
```tsx
<button className="w-8 h-8 flex items-center justify-center active:bg-gray-200/50 rounded-full transition-colors">
  <X className="w-5 h-5 text-[#007AFF]" />
</button>
```

#### Text Input
```tsx
<div className="bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40">
  <input
    type="text"
    placeholder="Placeholder"
    className="w-full px-4 py-4 bg-transparent text-[17px] text-black placeholder:text-gray-400 outline-none"
  />
</div>
```

#### Textarea
```tsx
<div className="bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40">
  <textarea
    placeholder="Description..."
    rows={4}
    className="w-full px-4 py-4 bg-transparent text-[15px] text-black placeholder:text-gray-400 outline-none resize-none"
  />
</div>
```

#### Modal
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
  
  {/* Modal */}
  <div className="relative bg-white/90 backdrop-blur-2xl rounded-[20px] w-full max-w-sm overflow-hidden shadow-2xl border border-white/50">
    <div className="p-6 text-center">
      <h3 className="text-[17px] text-black mb-2">Title</h3>
      <p className="text-[13px] text-gray-600">Description</p>
    </div>
    <div className="border-t border-gray-200/50">
      <button className="w-full px-4 py-3 text-[17px] text-[#007AFF] active:bg-gray-100/50 transition-colors">
        Action
      </button>
    </div>
  </div>
</div>
```

#### Info Card Row
```tsx
<div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200/50">
  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
    <Calendar className="w-4 h-4 text-[#007AFF]" />
  </div>
  <div className="flex-1">
    <div className="text-[13px] text-gray-500">Label</div>
    <div className="text-[15px] text-black">Value</div>
  </div>
</div>
```

#### Tag/Badge
```tsx
<span className="px-2 py-1 bg-blue-500/20 text-blue-700 text-[12px] rounded-full">
  Label
</span>
```

#### Progress Bar
```tsx
<div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
  <div 
    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
    style={{ width: `${progress}%` }}
  ></div>
</div>
```

#### Checkbox States
```tsx
// Unchecked
<Circle className="w-6 h-6 text-gray-400" />

// Checked
<CheckCircle2 className="w-6 h-6 text-[#007AFF]" />

// Custom checkmark
<div className="w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center">
  <Check className="w-4 h-4 text-white" strokeWidth={3} />
</div>
```

#### Like Button (Facebook Style)
```tsx
<button className="flex items-center gap-1.5 active:scale-95 transition-transform">
  <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
  <span className={`text-[13px] ${liked ? 'text-red-500' : 'text-gray-500'}`}>
    {likeCount}
  </span>
</button>
```

---

### 8. ANIMATIONS & INTERACTIONS

```tsx
// Transitions
transition-colors      // For color changes
transition-all        // For multiple properties
transition-transform  // For scale/position

// Active States
active:scale-98       // Button press (large buttons)
active:scale-95       // Button press (small buttons)
active:bg-white/20    // Surface press
active:bg-gray-200/50 // Icon button press

// Hover (for desktop)
hover:bg-gray-100/50
```

---

### 9. ICON SYSTEM

**Library**: `lucide-react`

**Common Icons:**
```tsx
import {
  ChevronLeft,      // Back navigation
  X,                // Close
  MoreHorizontal,   // More menu
  Calendar,         // Dates
  Users,            // People
  Tag,              // Labels
  Flag,             // Priority
  CheckSquare,      // Checklist
  MessageCircle,    // Comments
  Trash2,           // Delete
  Send,             // Submit
  Heart,            // Like
  Reply,            // Reply
  Plus,             // Add
  Circle,           // Unchecked
  CheckCircle2,     // Checked
  Check,            // Confirmation
} from "lucide-react";
```

**Icon Sizes:**
```tsx
w-4 h-4   // Small (16px)
w-5 h-5   // Standard (20px) - MẶC ĐỊNH
w-6 h-6   // Large (24px)
```

**Icon Colors:**
```tsx
text-[#007AFF]  // Primary actions
text-gray-500   // Secondary
text-red-600    // Destructive
text-green-600  // Success
text-orange-600 // Warning
```

---

### 10. BẮT BUỘC PHẢI TUÂN THỦ

✅ **LUÔN LUÔN:**
- Dùng `max-w-md mx-auto` cho mobile container
- Dùng `rounded-[20px]` cho cards (KHÔNG dùng `rounded-lg` hay `rounded-2xl`)
- Dùng `text-[17px]`, `text-[15px]`, `text-[13px]` (KHÔNG dùng `text-lg`, `text-base`, v.v.)
- Dùng `bg-white/30 backdrop-blur-xl` cho glass surfaces
- Dùng `#007AFF` cho iOS Blue
- Dùng `active:bg-white/20` cho list item press states
- Dùng `border-b border-gray-200/50 last:border-b-0` cho list separators
- Dùng `shadow-xl shadow-black/5` cho card shadows
- Dùng `flex-shrink-0` cho avatars và icons trong flex containers
- Dùng `min-w-0` cho flex items có truncate text

❌ **KHÔNG BAO GIỜ:**
- Dùng solid backgrounds (trừ buttons)
- Dùng hard shadows (drop-shadow-lg, shadow-2xl cho non-modal elements)
- Dùng font sizes khác iOS standards
- Dùng colors ngoài palette đã định nghĩa
- Tạo custom CSS classes (dùng Tailwind utilities only)
- Dùng `rounded-2xl` (dùng `rounded-[20px]` thay thế)
- Quên `backdrop-blur-xl` khi dùng transparent backgrounds

---

### 11. RESPONSIVE & LAYOUT

```tsx
// Container
max-w-md mx-auto  // 448px max width, centered

// Full height
min-h-screen

// Flexbox centering
min-h-screen flex items-center justify-center

// Scrollable with hidden scrollbar
overflow-y-auto scrollbar-hide

// Safe area (for iOS)
safe-area-bottom  // Custom class for bottom padding
```

**Custom CSS (add to globals.css if needed):**
```css
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.safe-area-bottom {
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
}

.active\:scale-98:active {
  transform: scale(0.98);
}
```

---

### 12. STATE MANAGEMENT PATTERNS

```tsx
// Toggle state
const [selected, setSelected] = useState(false);

// Conditional styling
className={`${selected ? 'text-[#007AFF]' : 'text-gray-500'}`}

// Disabled state
disabled={!canSubmit}
className={`${canSubmit ? 'bg-[#007AFF]' : 'bg-gray-300'}`}

// Like state
const [liked, setLiked] = useState(false);
className={`${liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
```

---

## 📝 YÊU CẦU CỦA TÔI

[THÊM YÊU CẦU CỤ THỂ CỦA BẠN VÀO ĐÂY]

Ví dụ:
- "Tạo một màn hình Settings với các options như: Profile, Notifications, Privacy, About"
- "Tạo component TaskCard hiển thị task với title, assignees, due date, và priority"
- "Tạo modal chọn ngày tháng với calendar picker"

---

## ✅ CHECKLIST TRƯỚC KHI TRẢ LỜI

Hãy đảm bảo code của bạn:
- [ ] Có liquid glass background với blur orbs
- [ ] Dùng glass surfaces (`bg-white/30 backdrop-blur-xl`)
- [ ] Dùng chính xác iOS font sizes (`text-[17px]`, `text-[15px]`, `text-[13px]`)
- [ ] Dùng `#007AFF` cho primary actions
- [ ] Dùng `rounded-[20px]` cho cards
- [ ] Có proper shadows (`shadow-xl shadow-black/5`)
- [ ] Có active states (`active:bg-white/20`, `active:scale-98`)
- [ ] Dùng `lucide-react` icons với đúng sizes
- [ ] Có `max-w-md mx-auto` container
- [ ] Component có TypeScript types/interfaces

---

## 🎯 OUTPUT MONG MUỐN

Hãy trả lời với:
1. **File component hoàn chỉnh** (React + TypeScript)
2. **Import statements** đầy đủ
3. **Props interface** rõ ràng
4. **Tuân thủ 100%** design system ở trên
5. **Không có placeholders** - code phải chạy ngay được

---

**Sẵn sàng? Hãy bắt đầu tạo component theo yêu cầu của tôi!** 🚀
