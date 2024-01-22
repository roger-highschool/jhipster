package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * A Post.
 */
@Entity
@Table(name = "post")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Post implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private Instant date;

    @NotNull
    @Column(name = "title", nullable = false, unique = true)
    private String title;

    @Lob
    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "published")
    private Boolean published;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "post")
    @JsonIgnoreProperties(value = { "user", "post" }, allowSetters = true)
    private Set<Comment> comments = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Post id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDate() {
        return this.date;
    }

    public Post date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public String getTitle() {
        return this.title;
    }

    public Post title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return this.content;
    }

    public Post content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getPublished() {
        return this.published;
    }

    public Post published(Boolean published) {
        this.setPublished(published);
        return this;
    }

    public void setPublished(Boolean published) {
        this.published = published;
    }

    public Set<Comment> getComments() {
        return this.comments;
    }

    public void setComments(Set<Comment> comments) {
        if (this.comments != null) {
            this.comments.forEach(i -> i.setPost(null));
        }
        if (comments != null) {
            comments.forEach(i -> i.setPost(this));
        }
        this.comments = comments;
    }

    public Post comments(Set<Comment> comments) {
        this.setComments(comments);
        return this;
    }

    public Post addComment(Comment comment) {
        this.comments.add(comment);
        comment.setPost(this);
        return this;
    }

    public Post removeComment(Comment comment) {
        this.comments.remove(comment);
        comment.setPost(null);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Post user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Post)) {
            return false;
        }
        return getId() != null && getId().equals(((Post) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Post{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", title='" + getTitle() + "'" +
            ", content='" + getContent() + "'" +
            ", published='" + getPublished() + "'" +
            "}";
    }
}
