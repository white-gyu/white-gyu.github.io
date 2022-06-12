import React from 'react'
import { graphql } from 'gatsby'

import { Head } from '../components/head'
import { rhythm } from '../utils/typography'
import * as Lang from '../constants'

import '../styles/resume.scss'

export default ({ data }) => {
  const resumes = data.allMarkdownRemark.edges

  const resume = resumes
    .filter(({ node }) => node.frontmatter.lang === Lang.KOREAN)
    .map(({ node }) => node)[0]

  return (
      <>
        <Head
            title={"About white-gyu"}
            description={"white-gyu Resume"}
            thumbnail={"https://user-images.githubusercontent.com/67765871/173239925-528506e0-9d6a-456b-8df3-5551fa43a503.png"}
        />
        <div className="about"
            style={{
                marginLeft: `auto`,
                marginRight: `auto`,
                maxWidth: rhythm(28),
                padding: `${rhythm(0.5)} ${rhythm(3 / 4)} ${rhythm(1.5)} ${rhythm(
                    3 / 4
                )}`,
            }}
        >
      <div dangerouslySetInnerHTML={{ __html: resume.html }} />
    </div>
    </>
  )
}

export const pageQuery = graphql`
  query {
    allMarkdownRemark(filter: { frontmatter: { category: { eq: null } } }) {
      edges {
        node {
          id
          excerpt(pruneLength: 160)
          html
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            lang
          }
        }
      }
    }
  }
`
