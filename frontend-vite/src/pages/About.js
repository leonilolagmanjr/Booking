import React from 'react';
import { Container, Typography, Box, Card, CardContent, Avatar, Button, Divider } from '@mui/material';
import SteamLogo from '../logo.svg';

const About = () => {
  return React.createElement(Box, {
    sx: {
      minHeight: '100vh',
      bgcolor: '#2C3639',
      color: '#DCD7C9',
      py: 6,
      position: 'relative',
    }
  },
    React.createElement(Container, { maxWidth: "md" },
      // Header
      React.createElement(Box, { 
        sx: { 
          display: 'flex', 
          alignItems: 'center', 
          mb: 6,
          pb: 2,
          borderBottom: '2px solid #A27B5C'
        } },
        React.createElement(Avatar, { 
          src: SteamLogo, 
          sx: { 
            width: 80, 
            height: 80, 
            mr: 3, 
            bgcolor: '#3F4E4F',
            border: '3px solid #A27B5C',
            boxShadow: '0 4px 12px rgba(162, 123, 92, 0.3)'
          } 
        }),
        React.createElement(Box, null,
          React.createElement(Typography, { 
            variant: "h3", 
            fontWeight: "bold", 
            color: '#DCD7C9',
            sx: { 
              mb: 0.5,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            } 
          }, "About the Platform"),
          React.createElement(Typography, { 
            variant: "subtitle1", 
            color: '#A27B5C',
            sx: { fontStyle: 'italic' }
          }, "Connecting talent with opportunity")
        )
      ),

      // Developer Introduction
      React.createElement(Card, {
        sx: {
          mb: 6,
          bgcolor: '#3F4E4F',
          border: '2px solid rgba(162, 123, 92, 0.3)',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 28px rgba(162, 123, 92, 0.2)',
            borderColor: '#A27B5C'
          }
        }
      },
        React.createElement(CardContent, { sx: { p: 4 } },
          React.createElement(Typography, { 
            variant: "h4", 
            fontWeight: "bold", 
            color: '#A27B5C', 
            sx: { 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            } 
          },
            React.createElement('span', null, "👨‍💻 Developer Introduction")
          ),
          React.createElement(Typography, { 
            variant: "body1", 
            sx: { 
              lineHeight: 1.7,
              fontSize: '1.1rem',
              color: '#DCD7C9'
            } 
          },
            "Hi, I'm Leonilo Lagman Jr, a passionate solo Full Stack Developer specializing in the MERN stack (MongoDB, Express.js, React.js, Node.js). I love building scalable platforms, modern web applications, and systems that solve real-world problems. This project is heavily inspired by Steam's community features, reimagined for job connections, collaboration, and social interaction. As a solo developer, I handle everything from backend APIs to frontend UI/UX, ensuring a smooth, polished experience."
          )
        )
      ),

      // Project Overview
      React.createElement(Card, {
        sx: {
          mb: 6,
          bgcolor: '#3F4E4F',
          border: '2px solid rgba(162, 123, 92, 0.3)',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
        }
      },
        React.createElement(CardContent, { sx: { p: 4 } },
          React.createElement(Typography, { 
            variant: "h4", 
            fontWeight: "bold", 
            color: '#A27B5C', 
            sx: { 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            } 
          },
            React.createElement('span', null, "🚀 Project Overview")
          ),
          React.createElement(Typography, { 
            variant: "body1", 
            sx: { 
              lineHeight: 1.7,
              fontSize: '1.1rem',
              color: '#DCD7C9'
            } 
          },
            "This MERN website is a job matching and social networking platform that blends the functionality of a job board with the interaction of a social community. It aims to connect freelancers, developers, and creators in a more social and engaging way than typical job boards. Users can post and accept jobs (remote or on-site), chat in real time, post in forums and social feeds, share videos, images, and updates, and customize their profiles like Steam (themes, avatars, backgrounds, showcases)."
          )
        )
      ),

      // Core Features
      React.createElement(Card, {
        sx: {
          mb: 6,
          bgcolor: '#3F4E4F',
          border: '2px solid rgba(162, 123, 92, 0.3)',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
        }
      },
        React.createElement(CardContent, { sx: { p: 4 } },
          React.createElement(Typography, { 
            variant: "h4", 
            fontWeight: "bold", 
            color: '#A27B5C', 
            sx: { 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            } 
          },
            React.createElement('span', null, "✨ Core Features")
          ),
          React.createElement(Typography, { 
            variant: "body1", 
            sx: { 
              lineHeight: 1.7,
              fontSize: '1.1rem',
              color: '#DCD7C9',
              mb: 3
            } 
          },
            "The platform offers a comprehensive set of features designed to foster community and facilitate job matching:"
          ),
          React.createElement(Box, { 
            component: 'ul', 
            sx: { 
              pl: 4,
              '& li': {
                mb: 2,
                color: '#DCD7C9',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                position: 'relative',
                pl: 2
              },
              '& li:before': {
                content: '"▸"',
                color: '#A27B5C',
                fontWeight: 'bold',
                display: 'inline-block',
                width: '1em',
                marginLeft: '-1em',
                position: 'absolute',
                left: 0
              }
            } 
          },
            React.createElement('li', null, "Job Posting and Management: Users can create, browse, and manage job listings for remote or on-site opportunities."),
            React.createElement('li', null, "Real-Time Chat: Integrated chat system for instant communication between users."),
            React.createElement('li', null, "Forums and Social Feeds: Discussion forums and social media-like feeds for sharing updates, images, and videos."),
            React.createElement('li', null, "Profile Customization: Steam-inspired profiles with themes, avatars, backgrounds, and showcases."),
            React.createElement('li', null, "Video Sharing: Upload and share videos within the community."),
            React.createElement('li', null, "Payment and Transactions: Secure payment methods and transaction history for job-related payments."),
            React.createElement('li', null, "Verification: KYC verification for trusted interactions.")
          )
        )
      ),

      // Technical Architecture
      React.createElement(Card, {
        sx: {
          mb: 6,
          bgcolor: '#3F4E4F',
          border: '2px solid rgba(162, 123, 92, 0.3)',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
        }
      },
        React.createElement(CardContent, { sx: { p: 4 } },
          React.createElement(Typography, { 
            variant: "h4", 
            fontWeight: "bold", 
            color: '#A27B5C', 
            sx: { 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            } 
          },
            React.createElement('span', null, "⚙️ Technical Architecture")
          ),
          React.createElement(Typography, { 
            variant: "body1", 
            sx: { 
              lineHeight: 1.7,
              fontSize: '1.1rem',
              color: '#DCD7C9',
              mb: 3
            } 
          },
            "The platform is built using a robust MERN stack architecture:"
          ),
          React.createElement(Box, { 
            component: 'ul', 
            sx: { 
              pl: 4,
              '& li': {
                mb: 2,
                color: '#DCD7C9',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                position: 'relative',
                pl: 2
              },
              '& li:before': {
                content: '"▸"',
                color: '#A27B5C',
                fontWeight: 'bold',
                display: 'inline-block',
                width: '1em',
                marginLeft: '-1em',
                position: 'absolute',
                left: 0
              }
            } 
          },
            React.createElement('li', null, "MongoDB: NoSQL database for storing user data, jobs, chats, posts, and other entities."),
            React.createElement('li', null, "Express.js: Backend framework for routing, authentication, and API endpoints."),
            React.createElement('li', null, "React.js: Frontend library for building the user interface using plain JavaScript and React.createElement."),
            React.createElement('li', null, "Node.js: Runtime environment for the backend server and Socket.IO integration."),
            React.createElement('li', null, "Socket.IO: Enables real-time features like chat, notifications, and presence updates."),
            React.createElement('li', null, "Google Maps API: For location selection and marking jobs as remote or on-site."),
            React.createElement('li', null, "Material-UI (MUI): Design system for responsive layouts and consistent theming."),
            React.createElement('li', null, "JWT Authentication: Secure user sessions and login management."),
            React.createElement('li', null, "Vercel: Frontend Hosting."),
            React.createElement('li', null, "Render: Backend Hosting."),
            React.createElement('li', null, "Railway: Websocket Hosting.")
          )
        )
      ),

      // Vision & Future Roadmap
      React.createElement(Card, {
        sx: {
          mb: 6,
          bgcolor: '#3F4E4F',
          border: '2px solid rgba(162, 123, 92, 0.3)',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          background: 'linear-gradient(135deg, #3F4E4F 0%, #2C3639 100%)'
        }
      },
        React.createElement(CardContent, { sx: { p: 4 } },
          React.createElement(Typography, { 
            variant: "h4", 
            fontWeight: "bold", 
            color: '#A27B5C', 
            sx: { 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            } 
          },
            React.createElement('span', null, "🎯 Vision & Future Roadmap")
          ),
          React.createElement(Typography, { 
            variant: "body1", 
            sx: { 
              lineHeight: 1.7,
              fontSize: '1.1rem',
              color: '#DCD7C9'
            } 
          },
            "The vision is to create a vibrant community where freelancers and creators can find meaningful work, collaborate on projects, and build lasting professional relationships. Future enhancements include advanced AI-powered job matching, expanded social features like groups and events, mobile app development, and integration with popular tools like GitHub and LinkedIn. The platform aims to evolve into a comprehensive ecosystem for creative professionals."
          )
        )
      ),

      React.createElement(Divider, { 
        sx: { 
          bgcolor: '#A27B5C', 
          my: 6,
          height: 3,
          borderRadius: 2
        } 
      }),

      // Developer Card
      React.createElement(Card, { 
        sx: { 
          bgcolor: '#3F4E4F', 
          color: '#DCD7C9', 
          boxShadow: '0 12px 32px rgba(162, 123, 92, 0.3)',
          maxWidth: 500, 
          mx: 'auto', 
          mt: 4,
          border: '3px solid #A27B5C',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #A27B5C 0%, #8a6a50 100%)'
          }
        } 
      },
        React.createElement(CardContent, { 
          sx: { 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            p: 5 
          } 
        },
          React.createElement(Avatar, {
            src: "https://github.com/leonilolagmanjr",
            sx: { 
              width: 120, 
              height: 120, 
              mb: 3, 
              bgcolor: '#2C3639',
              border: '4px solid #A27B5C',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
            }
          }),
          React.createElement(Typography, { 
            variant: "h5", 
            color: '#A27B5C', 
            fontWeight: "bold",
            sx: { mb: 1 } 
          }, "Leonilo Lagman Jr"),
          React.createElement(Typography, { 
            variant: "body2", 
            color: '#DCD7C9', 
            sx: { 
              mb: 1,
              fontSize: '1.1rem'
            } 
          }, "Solo Full Stack Developer"),
          React.createElement(Typography, { 
            variant: "body2", 
            sx: { 
              textAlign: 'center', 
              mb: 3,
              color: 'rgba(220, 215, 201, 0.8)',
              lineHeight: 1.6
            } 
          },
            "Experienced in building full-featured platforms and web apps. I specialize in handling projects end-to-end — from backend systems to frontend UI/UX."
          ),
          React.createElement(Button, {
            variant: "contained",
            href: "https://github.com/leonilolagmanjr",
            target: "_blank",
            sx: { 
              bgcolor: '#A27B5C', 
              color: '#2C3639', 
              mt: 2, 
              textTransform: 'none', 
              fontWeight: 'bold',
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              border: '2px solid #A27B5C',
              '&:hover': {
                bgcolor: '#8a6a50',
                borderColor: '#8a6a50',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(162, 123, 92, 0.4)'
              }
            }
          }, "View Portfolio")
        )
      ),

      // Footer
      React.createElement(Box, { 
        sx: { 
          mt: 8, 
          textAlign: 'center',
          pt: 4,
          borderTop: '1px solid rgba(162, 123, 92, 0.3)'
        } 
      },
        React.createElement(Typography, { 
          variant: "body1", 
          sx: { 
            color: 'rgba(220, 215, 201, 0.7)',
            fontSize: '0.95rem'
          } 
        },
          `© ${new Date().getFullYear()} Built by Leonilo Lagman Jr — All rights reserved.`
        ),
        React.createElement(Typography, { 
          variant: "body2", 
          sx: { 
            color: 'rgba(162, 123, 92, 0.6)',
            mt: 1,
            fontSize: '0.85rem'
          } 
        },
          "MERN Stack | Material-UI | Socket.IO | Full Stack Development"
        )
      )
    )
  );
};

export default About;