import { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, 
  Send, 
  Smile, 
  Image, 
  Video, 
  FileText,
  X,
  BarChart2,
  Download
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useDispatch } from 'react-redux';
import { setMessages } from '../features/chat/chatSlice';

const MessageInput = ({setNewMessage , currentMessage , setCurrentMessage  }) => {
   const dispath = useDispatch();
  
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [showPollForm, setShowPollForm] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const formRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim() === '' && attachments.length === 0 && !showPollForm) return;

    const newMsg = {
      id: Date.now(),
      sender: localStorage.getItem('userId'),
      content: currentMessage,
      createdAt: new Date().toISOString(),
      attachments: attachments.map(file => ({
        type: file.type,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      })),
      poll: showPollForm && pollQuestion.trim() !== '' ? {
        question: pollQuestion,
        options: pollOptions.filter(opt => opt.trim() !== '')
      } : null
    };

    dispath(setMessages(newMsg));
    setNewMessage(newMsg);
    resetForm();
  };

  const resetForm = () => {
    setCurrentMessage('');
    setAttachments([]);
    setShowPollForm(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
  };

  const handleEmojiClick = (emojiData) => {
    setCurrentMessage(prev => prev + emojiData.emoji);
  };

  const handleFileChange = (e, type) => {
    console.log();
    
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      if (type === 'image') return file.type.startsWith('image/');
      if (type === 'video') return file.type.startsWith('video/');
      return true;
    });

    setAttachments(prev => [...prev, ...validFiles]);
    setShowAttachmentMenu(false);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const handleRemovePollOption = (index) => {
    if (pollOptions.length <= 2) return;
    const newOptions = [...pollOptions];
    newOptions.splice(index, 1);
    setPollOptions(newOptions);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="p-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 space-y-2">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className={`relative group rounded-lg border p-2 ${
                file.type.startsWith('image/') ? 
                  'w-24 h-24' : 
                  'w-full max-w-xs'
              } ${
                file.type.startsWith('image/') ? 
                  '' : 
                  'bg-gray-50 dark:bg-gray-700'
              }`}>
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                ) : file.type.startsWith('video/') ? (
                  <div className="flex items-center p-2">
                    <Video className="h-5 w-5 mr-2 text-blue-500" />
                    <div className="truncate flex-1">
                      <p className="text-sm truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-2">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <div className="truncate flex-1">
                      <p className="text-sm truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setAttachments([])}
            className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400"
          >
            Clear all attachments
          </button>
        </div>
      )}

      {/* Poll Form */}
      {showPollForm && (
        <div className="mb-3 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">Create Poll</h3>
            <button 
              onClick={() => setShowPollForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <input
            type="text"
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="w-full p-3 mb-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="space-y-2 mb-3">
            {pollOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...pollOptions];
                    newOptions[index] = e.target.value;
                    setPollOptions(newOptions);
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {pollOptions.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePollOption(index)}
                    className="p-2 text-gray-500 hover:text-red-500 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleAddPollOption}
              className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium"
            >
              + Add option
            </button>
            <span className="text-xs text-gray-500">
              {pollOptions.length}/10 options
            </span>
          </div>
        </div>
      )}

      {/* Attachment Menu */}
      {showAttachmentMenu && (
        <div className="absolute bottom-20 left-4 bg-white dark:bg-gray-700 rounded-xl shadow-xl p-3 z-20 border border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => imageInputRef.current.click()}
              className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-2">
                <Image className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-xs font-medium">Photo</span>
              <input
                type="file"
                ref={imageInputRef}
                onChange={(e) => handleFileChange(e, 'image')}
                accept="image/*"
                className="hidden"
                multiple
              />
            </button>
            <button
              onClick={() => videoInputRef.current.click()}
              className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-2">
                <Video className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-xs font-medium">Video</span>
              <input
                type="file"
                ref={videoInputRef}
                onChange={(e) => handleFileChange(e, 'video')}
                accept="video/*"
                className="hidden"
                multiple
              />
            </button>
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-2">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-xs font-medium">File</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, 'file')}
                className="hidden"
                multiple
              />
            </button>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Smile className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        
        {showEmojiPicker && (
          <div className="absolute bottom-14 left-0 z-10">
            <EmojiPicker 
              onEmojiClick={handleEmojiClick} 
              width={300} 
              height={350}
              skinTonesDisabled
              previewConfig={{ showPreview: false }}
              theme="dark"
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>

        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 py-3 px-4 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        />

        <button
          type="submit"
          disabled={currentMessage.trim() === '' && attachments.length === 0 && !(showPollForm && pollQuestion.trim() !== '')}
          className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;