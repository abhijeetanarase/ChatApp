import { 
  Image, 
  Video, 
  FileText,
  BarChart2,
  Download
} from 'lucide-react';

const Message = ({ message }) => {

  const userId = localStorage.getItem("userId")
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const convertTime = (dateString) =>{
    const date = new Date(dateString);
    return date.toLocaleTimeString([],{
      hour : "numeric",
      minute : "2-digit",
      hour12 : true
    })
    
  }

  const renderAttachment = (attachment, index) => {
    const fileType = attachment.type.split('/')[0];
    const isImage = fileType === 'image';
    const isVideo = fileType === 'video';

    return (
      <div key={index} className={`mt-3 rounded-xl overflow-hidden border ${
        message.sender === userId 
          ? 'border-blue-200 dark:border-blue-800' 
          : 'border-gray-200 dark:border-gray-600'
      }`}>
        {isImage ? (
          <div className="relative group">
            <img 
              src={attachment.url} 
              alt="Attachment" 
              className="w-full max-h-80 object-cover"
            />
            <a
              href={attachment.url}
              download={attachment.name}
              className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Download className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </a>
          </div>
        ) : isVideo ? (
          <div className="relative">
            <video controls className="w-full max-h-80 bg-black">
              <source src={attachment.url} type={attachment.type} />
            </video>
          </div>
        ) : (
          <div className={`flex items-center p-4 ${
            message.sender === userId
              ? 'bg-blue-50 dark:bg-blue-900/30'
              : 'bg-gray-50 dark:bg-gray-700'
          }`}>
            <FileText className="h-6 w-6 mr-3 text-blue-500 dark:text-blue-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {attachment.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(attachment.size)}
              </p>
            </div>
            <a 
              href={attachment.url} 
              download={attachment.name}
              className="ml-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Download className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </a>
          </div>
        )}
      </div>
    );
  };

  const renderPoll = () => {
    if (!message.poll) return null;

    return (
      <div className={`mt-3 p-4 rounded-xl ${
        message.sender === userId
          ? 'bg-blue-50 dark:bg-blue-900/30'
          : 'bg-gray-50 dark:bg-gray-700'
      }`}>
        <div className="font-medium text-gray-800 dark:text-gray-200 mb-3">
          {message.poll.question}
        </div>
        <div className="space-y-2 mb-3">
          {message.poll.options.map((option, index) => (
            <div key={index} className="relative">
              <div className={`w-full p-3 rounded-lg text-sm ${
                message.sender === userId
                  ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
              }`}>
                {option}
              </div>
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500/10 rounded-lg"
                style={{ width: `${Math.random() * 100}%` }}
              ></div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <span>{message.poll.options.length} options</span>
          <span>Tap to vote</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex mb-5 ${message.sender === userId ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] lg:max-w-[70%] px-5 py-3 rounded-2xl ${
        message.sender === userId
          ? 'bg-blue-600 text-white rounded-br-none'
          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
      } shadow-sm ${
        message.sender === userId ? 'shadow-blue-100 dark:shadow-blue-900/50' : 'shadow-gray-100 dark:shadow-gray-900/50'
      }`}>
        {/* Text content */}
        {message.content && (
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
            {message.content}
          </p>
        )}
        
        {/* Attachments */}
        {message.attachments?.map((attachment, index) => (
          renderAttachment(attachment, index)
        ))}
        
        {/* Poll */}
        {renderPoll()}
        
        {/* Time */}
        <div className={`text-xs mt-2 flex items-center ${
          message.sender === userId ? 'justify-end text-blue-100' : 'justify-start text-gray-500 dark:text-gray-400'
        }`}>
          <span>{convertTime(message.createdAt)}</span>
          {message.sender === userId && (
            <span className="ml-1 text-blue-200">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;