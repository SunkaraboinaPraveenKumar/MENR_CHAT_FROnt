import React from 'react';
import { Box, Avatar, Typography, useMediaQuery } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

//@ts-ignore
function extractCodeFromString(message) {
  if (message.includes('```')) {
    const blocks = message.split('```');
    //@ts-ignore
    return blocks.filter(block => block.trim() !== ''); // Filter out empty blocks
  }
  return [];
}
//@ts-ignore
function isCodeBlock(str) {
  return /[=\[\]{}#;/]/.test(str) || str.includes('//');
}
//@ts-ignore
const parseContent = (content) => {
  const regexBold = /\*\*(.*?)\*\*/g;
  const regexList = /(\* .*?)(?=\* |$)/g;
  const regexInlineCode = /`(.*?)`/g;
  //@ts-ignore
  const elements = [];

  // Split content into lines for better handling of new lines
  const lines = content.split('\n');
  //@ts-ignore
  lines.forEach((line, index) => {
    let lineContent = [];
    let lastIndex = 0;
//@ts-ignore
    line.replace(regexBold, (match, p1, offset) => {
      if (offset > lastIndex) {
        lineContent.push(line.slice(lastIndex, offset));
      }
      lineContent.push(<strong key={offset}>{p1}</strong>);
      lastIndex = offset + match.length;
    });
    //@ts-ignore
    line.replace(regexList, (match, p1, offset) => {
      if (offset > lastIndex) {
        lineContent.push(line.slice(lastIndex, offset));
      }
      lineContent.push(<li key={offset}>{p1.slice(2)}</li>);
      lastIndex = offset + match.length;
    });
    //@ts-ignore
    line.replace(regexInlineCode, (match, p1, offset) => {
      if (offset > lastIndex) {
        lineContent.push(line.slice(lastIndex, offset));
      }
      lineContent.push(<code key={offset}>{p1}</code>);
      lastIndex = offset + match.length;
    });

    if (lastIndex < line.length) {
      lineContent.push(line.slice(lastIndex));
    }

    elements.push(
      <Typography key={index} component="p" sx={{ marginTop: 1, marginBottom: 1 }}>
        {lineContent.length > 0 ? lineContent : line}
      </Typography>
    );
  });
  //@ts-ignore
  return elements;
};
//@ts-ignore
const ChatItem = ({ content, role }) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = useAuth();
  //@ts-ignore
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const userInitials = () => {
    if (auth?.user?.name) {
      const nameParts = auth.user.name.split(' ');
      return nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`
        : nameParts[0][0] || 'U';
    }
    return 'U';
  };

  return role === 'assistant' ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 2, md: 3 },
        pr: { xs: 3, md: 4 },
        bgcolor: '#004d5612',
        gap: 2,
        borderRadius: 2,
        my: 1,
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <Avatar sx={{ ml: 0 }}>
        <img src="openai.png" alt="openai" width={"30px"} />
      </Avatar>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexDirection: 'column' }}>
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          {messageBlocks.length === 0 ? (
            <Typography sx={{ fontSize: { xs: '16px', md: '20px' }, pr: { xs: 3, md: 4 } }}>
              {parseContent(content)}
            </Typography>
          ) : (
            //@ts-ignore
            messageBlocks.map((block, index) =>
              isCodeBlock(block) ? (
                <SyntaxHighlighter
                  key={index}
                  style={coldarkDark}
                  language="javascript"
                  customStyle={{ fontSize: '14px', whiteSpace: 'pre-wrap', overflowX: 'auto', padding: '8px' }}
                >
                  {block}
                </SyntaxHighlighter>
              ) : (
                <Typography key={index} sx={{ fontSize: { xs: '16px', md: '20px' }, pr: { xs: 3, md: 4 } }}>
                  {parseContent(block)}
                </Typography>
              )
            )
          )}
        </Box>
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 2, md: 3 },
        pr: { xs: 3, md: 4 },
        bgcolor: '#004d56',
        gap: 2,
        borderRadius: 2,
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexDirection: 'column' }}>
        <Avatar sx={{ ml: 0, bgcolor: 'black', color: 'white' }}>
          {userInitials()}
        </Avatar>
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          {messageBlocks.length === 0 ? (
            <Typography sx={{ fontSize: { xs: '16px', md: '20px' }, pr: { xs: 3, md: 4 } }}>
              {parseContent(content)}
            </Typography>
          ) : (
            //@ts-ignore
            messageBlocks.map((block, index) =>
              isCodeBlock(block) ? (
                <SyntaxHighlighter
                  key={index}
                  style={coldarkDark}
                  language="javascript"
                  customStyle={{ fontSize: '14px', whiteSpace: 'pre-wrap', overflowX: 'auto', padding: '8px' }}
                >
                  {block}
                </SyntaxHighlighter>
              ) : (
                <Typography key={index} sx={{ fontSize: { xs: '16px', md: '20px' }, pr: { xs: 3, md: 4 } }}>
                  {parseContent(block)}
                </Typography>
              )
            )
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatItem;
