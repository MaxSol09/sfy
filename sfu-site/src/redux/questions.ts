import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from 'axios'


export const fetchQuestions = createAsyncThunk('fetch/posts', async() => {
    const {data} = await axios.get('http://localhost:4444/posts')

    return data
})

export const fetchTags = createAsyncThunk('tags/posts', async() => {
    const {data} = await axios.get('http://localhost:4444/tags')

    console.log(data)

    return data
})

type SubmitType = {
    title: string, 
    text: string, 
    tags: TypeTags[],
    userId: string
  }

export const createQuestion = createAsyncThunk('fetch/postCreate', async(postData: SubmitType) => {

    const {data} = await axios.post('http://localhost:4444/posts', postData)

    return data
})

export const sendImg = createAsyncThunk( 'img/fetch', async (formData: object) => {

    const {data} = await axios.post('http://localhost:4444/upload', formData)

    return data
})


export const deleteQuestion = createAsyncThunk('delete/Post', async (id: string) => {
    
    const {data} = await axios.delete(`http://localhost:4444/posts/${id}`)

    return data
}
)

type PostData = {
    id: string,
    text: string
}

export const getQuestion = createAsyncThunk(
    'getPost/fetch',
    async (id: string) => {
        const {data} = await axios.get(`http://localhost:4444/question/${id}`)

        return data
    }
)

interface TypeCommentData {
    postId: string,
    fullName: string,
    text: string,
    commentId: string,
    avatar?: string,
    userId: string,
}

export const createComment = createAsyncThunk('createComment/fetch', async (commentData: TypeCommentData) => {

    const {data} = await axios.post('http://localhost:4444/create/comment', commentData)

    return data.comments
})

interface TypeRemoveComment {
    postId: string, 
    commentId: string
}

export const deleteComment = createAsyncThunk('delete/comment', async (commentData: TypeRemoveComment) => {

    const {data} = await axios.post('http://localhost:4444/delete/comment', commentData)

    return data
})

  export type TypeTags = {
    tag: string,
    id: string
  }

  export type TypeComment = {
    userID: string,
    text: string,
    fullName: string,
    avatarUrl?: string,
    commentId: string
  }

  type TypeChanell = {
    fullName: string,
    _id: string,
    imageUrl?: string
  }

  export type TypePost = {
    createdAt: string,
    updateAt: string,
    user: TypeChanell | string,
    text: string,
    title: string,
    viewCount: number,
    __v: number,
    _id: string,
    tags: TypeTags[],
    comments: TypeComment[],
    imageUrl?: string
  } 

  type TypeImageValue = {
    path: string,
    url: string
  }

  type TypeStatus = 'none' | 'success' | 'loading' | 'errors'

  type TypeState = { 
    questions: {
        items: [] | TypePost[]
        status: TypeStatus
    }
    questionsArr: {
        items: [] | TypePost[]
    },
    myQuestions: {
        items: [] | TypePost[],
        status: TypeStatus
    },
    question: {
        items: {} | TypePost,
        status: TypeStatus
    },
    tags: {
        items: [] | TypeTags[],
        status: TypeStatus
    },   
    deleteQuestionStatus: {
        status: TypeStatus
    },
    createTag: {
        items: TypeTags[]
    },
    postChanges: {
        status: 'none' | TypeStatus,
        img: {
            status: TypeStatus,
            value: null | TypeImageValue
        }
    },
    commentCreate: {
        items: []
    }
  }



const initialState: TypeState = {
    questions: {
        items: [],
        status: 'loading'
    },
    questionsArr: {
        items: [] 
    },
    myQuestions: {
        items: [],
        status: 'loading'
    },
    question: {
        items: {},
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    },
    deleteQuestionStatus: {
        status: 'loading'
    },
    createTag: {
        items: []
    },
    postChanges: {
        status: 'none',
        img: {
            status: 'loading',
            value: null
        }
    },
    commentCreate: {
        items: []
    }
}



const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        createTag: (state, action) => {
            state.createTag.items = [...state.createTag.items, action.payload]
        },
        deleteTag: (state, action) => {
            state.createTag.items = state.createTag.items.filter(el => el.id !== action.payload)
        },
        deleteImg: (state) => {
            state.postChanges.img.value = null
        },
        getMyPosts: (state, action) => {
                state.myQuestions.items = state.questions.items.filter(el => {
                    const user = typeof(el.user) === 'string' ? {_id: el.user} : el.user as TypeChanell
                    return user._id === action.payload.id
                })
            

            state.myQuestions.status = 'success'
        },
        resetCreatePost: (state) => {
            state.createTag.items = []
            state.postChanges.img.value = null
        },
        resetPost: (state) => {
            state.question.items = {} as TypePost
        },
        resetPostStatus: (state) => {
            state.postChanges.status = 'none'
        },
        resetMyPostStatus: (state) => {
            state.myQuestions.status = 'loading'
        },
        popularPost: (state) => {
           state.questionsArr.items = state.questions.items.sort((a, b) => b.viewCount - a.viewCount) 
        },
        newPosts: (state) => {
            state.questionsArr.items = state.questions.items.sort((a, b) => {
                let c = new Date(a.createdAt).getTime();
                let d = new Date(b.createdAt).getTime();
                return d-c;
            });
        },
        oldPosts: (state) => {
            state.questionsArr.items = state.questions.items.sort((a, b) => {
                let c = new Date(a.createdAt).getTime();
                let d = new Date(b.createdAt).getTime();
                return c-d;
            });
        },
        searchPost: (state, action) => {
            console.log(action.payload)
            state.questionsArr.items = state.questions.items.filter(el => {
                    return el.title.toLowerCase() === action.payload.title.toLowerCase()
                }
            )
        }
    },
    extraReducers: (build) => {
        build.addCase(fetchQuestions.pending, (state) => {
                state.questions.items = []
                state.questions.status = 'loading'
            })
        .addCase(fetchQuestions.fulfilled, (state, action) => {
            state.questions.items = action.payload
            state.questionsArr.items = action.payload
            state.questions.status = 'success'
        })
        .addCase(fetchQuestions.rejected, (state) => {
            state.questions.items = []
            state.questions.status = 'errors'
        })
        .addCase(fetchTags.pending, (state) => {
            state.tags.items = []
            state.tags.status = 'loading'
        })
        .addCase(fetchTags.fulfilled, (state, action) => {
            state.tags.items = action.payload
            state.tags.status = 'success'
        })
        .addCase(fetchTags.rejected, (state) => {
            state.tags.items = []
            state.tags.status = 'errors'
        })
        .addCase(createQuestion.pending, (state) => {
            state.postChanges.status = 'loading'
        })
        .addCase(createQuestion.fulfilled, (state) => {
            state.postChanges.status = 'success'
        })
        .addCase(createQuestion.rejected, (state) => {
            state.postChanges.status = 'errors'
        })      
        .addCase(sendImg.pending, (state) => {
            state.postChanges.img.status = 'loading'
        })    
        .addCase(sendImg.fulfilled, (state, action) => {
            state.postChanges.img.status = 'success'
            state.postChanges.img.value = action.payload
        })      
        .addCase(sendImg.rejected, (state) => {
            state.postChanges.img.status = 'errors'
        })    
        .addCase(deleteQuestion.pending, (state) => {
            state.deleteQuestionStatus.status = 'loading'
        })      
        .addCase(deleteQuestion.fulfilled, (state, action) => {
            state.questions.items = state.questions.items.filter(el => el._id !== action.payload)
            state.deleteQuestionStatus.status = 'success'
        })        
        .addCase(getQuestion.pending, (state) => {
            state.question.status = 'loading'
        })   
        .addCase(getQuestion.fulfilled, (state, action) => {
            state.question.status = 'success'
            state.question.items = action.payload
        })   
        .addCase(getQuestion.rejected, (state) => {
            state.question.status = 'errors'
        })   
        .addCase(createComment.fulfilled, (state, action) => {

            if('comments' in state.question.items){
                state.question.items.comments = action.payload
            }
            
        })
        .addCase(deleteComment.fulfilled, (state, action) => {
            if ('comments' in state.question.items && Array.isArray(state.question.items.comments)) {
                state.question.items.comments = state.question.items.comments.filter(el => el.commentId !== action.payload.id)
            }
        })
    }
})

export const postsReducer = postsSlice.reducer
export const {createTag, deleteTag, deleteImg, getMyPosts, resetCreatePost, resetPost, resetPostStatus, resetMyPostStatus, popularPost, oldPosts, newPosts, searchPost} = postsSlice.actions
