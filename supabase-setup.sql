-- Supabase Database Setup Script for AI for Coders - CodeGym-Style Educational Platform
-- Run this in your Supabase SQL Editor
-- This replaces all previous schemas

-- ============================================
-- USER PROFILES (Enhanced)
-- ============================================
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  learning_goals TEXT,
  preferred_language TEXT DEFAULT 'python',
  profile_image_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================
-- PROGRAMMING LANGUAGES
-- ============================================
CREATE TABLE public.languages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  difficulty_level TEXT DEFAULT 'beginner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================
-- COURSES PER LANGUAGE
-- ============================================
CREATE TABLE public.courses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  language_id BIGINT NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT,
  duration_hours INT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================
-- LESSONS WITHIN COURSES
-- ============================================
CREATE TABLE public.lessons (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  course_id BIGINT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  content_html TEXT,
  code_example TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================
-- PRACTICE TASKS/CHALLENGES
-- ============================================
CREATE TABLE public.tasks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  lesson_id BIGINT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  problem_statement TEXT,
  starter_code TEXT,
  expected_output TEXT,
  difficulty TEXT DEFAULT 'easy',
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================
-- USER PROGRESS TRACKING
-- ============================================
CREATE TABLE public.user_progress (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id BIGINT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  task_id BIGINT REFERENCES public.tasks(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  attempts INT DEFAULT 0,
  score INT,
  code_solution TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, lesson_id, task_id)
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - PUBLIC READ (Content)
-- ============================================
CREATE POLICY "Languages are public read"
  ON public.languages FOR SELECT
  USING (true);

CREATE POLICY "Courses are public read"
  ON public.courses FOR SELECT
  USING (true);

CREATE POLICY "Lessons are public read"
  ON public.lessons FOR SELECT
  USING (true);

CREATE POLICY "Tasks are public read"
  ON public.tasks FOR SELECT
  USING (true);

-- ============================================
-- RLS POLICIES - USER PROGRESS (Private)
-- ============================================
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - USER PROFILES
-- ============================================
CREATE POLICY "Users can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- TRIGGER: AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, preferred_language)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'python'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TRIGGERS: AUTO-UPDATE UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA: PROGRAMMING LANGUAGES
-- ============================================
INSERT INTO public.languages (name, slug, description, icon_url, difficulty_level) VALUES
('Python', 'python', 'A versatile, beginner-friendly language known for its readability and vast ecosystem.', NULL, 'beginner'),
('Java', 'java', 'A robust, object-oriented language widely used in enterprise applications and Android development.', NULL, 'intermediate'),
('C', 'c', 'A foundational systems programming language that teaches computer science fundamentals.', NULL, 'intermediate');

-- ============================================
-- SEED DATA: PYTHON COURSES
-- ============================================
INSERT INTO public.courses (language_id, title, slug, description, difficulty_level, duration_hours, order_index) VALUES
(1, 'Python Basics', 'python-basics', 'Learn the fundamentals of Python programming including variables, data types, and basic operations.', 'beginner', 10, 1),
(1, 'Data Structures', 'python-data-structures', 'Master Python data structures like lists, dictionaries, sets, and tuples.', 'intermediate', 15, 2),
(1, 'Functions & Modules', 'python-functions-modules', 'Learn to write reusable code with functions and modules.', 'intermediate', 12, 3),
(1, 'File Handling', 'python-file-handling', 'Work with files and directories in Python for persistent data storage.', 'intermediate', 8, 4);

-- ============================================
-- SEED DATA: JAVA COURSES
-- ============================================
INSERT INTO public.courses (language_id, title, slug, description, difficulty_level, duration_hours, order_index) VALUES
(2, 'Java Syntax', 'java-syntax', 'Learn the basics of Java syntax, variables, data types, and operators.', 'beginner', 12, 1),
(2, 'OOP Concepts', 'java-oop-concepts', 'Master object-oriented programming with classes, inheritance, and polymorphism.', 'intermediate', 18, 2),
(2, 'Collections Framework', 'java-collections', 'Work with Java collections including Lists, Sets, Maps, and Queues.', 'intermediate', 15, 3),
(2, 'Exception Handling', 'java-exception-handling', 'Learn to handle errors and exceptions gracefully in Java.', 'intermediate', 10, 4);

-- ============================================
-- SEED DATA: C COURSES
-- ============================================
INSERT INTO public.courses (language_id, title, slug, description, difficulty_level, duration_hours, order_index) VALUES
(3, 'C Basics', 'c-basics', 'Learn the fundamentals of C programming including syntax, variables, and control structures.', 'beginner', 12, 1),
(3, 'Pointers & Arrays', 'c-pointers-arrays', 'Master pointers, arrays, and memory management in C.', 'intermediate', 20, 2),
(3, 'Functions', 'c-functions', 'Learn to create and use functions in C with proper parameter handling.', 'intermediate', 12, 3),
(3, 'File I/O', 'c-file-io', 'Work with file input/output operations in C for persistent data storage.', 'intermediate', 10, 4);

-- ============================================
-- SEED DATA: PYTHON LESSONS (Python Basics)
-- ============================================
INSERT INTO public.lessons (course_id, title, slug, description, content_html, code_example, order_index) VALUES
(1, 'Variables and Data Types', 'variables-data-types', 'Learn about Python variables and basic data types.', '<h2>Variables in Python</h2><p>In Python, variables are created when you assign a value to them. Python is dynamically typed, meaning you don&apos;t need to declare the type.</p><h3>Basic Data Types</h3><ul><li><strong>int</strong> - Whole numbers (e.g., 42, -7)</li><li><strong>float</strong> - Decimal numbers (e.g., 3.14, -0.5)</li><li><strong>str</strong> - Text strings (e.g., &quot;Hello&quot;)</li><li><strong>bool</strong> - Boolean values (True or False)</li></ul>', '# Variables and data types
name = "Alice"  # String
age = 25        # Integer
height = 5.7    # Float
is_student = True  # Boolean

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height}")
print(f"Is student: {is_student}")', 1),
(1, 'Basic Operations', 'basic-operations', 'Learn about arithmetic and comparison operations.', '<h2>Arithmetic Operations</h2><p>Python supports standard arithmetic operations:</p><table><tr><th>Operator</th><th>Description</th><th>Example</th></tr><tr><td>+</td><td>Addition</td><td>5 + 3 = 8</td></tr><tr><td>-</td><td>Subtraction</td><td>5 - 3 = 2</td></tr><tr><td>*</td><td>Multiplication</td><td>5 * 3 = 15</td></tr><tr><td>/</td><td>Division</td><td>6 / 2 = 3.0</td></tr><tr><td>//</td><td>Floor Division</td><td>7 // 2 = 3</td></tr><tr><td>%</td><td>Modulus</td><td>7 % 2 = 1</td></tr><tr><td>**</td><td>Exponentiation</td><td>2 ** 3 = 8</td></tr></table>', '# Basic arithmetic operations
a = 10
b = 3

print(f"Addition: {a} + {b} = {a + b}")
print(f"Subtraction: {a} - {b} = {a - b}")
print(f"Multiplication: {a} * {b} = {a * b}")
print(f"Division: {a} / {b} = {a / b}")
print(f"Floor Division: {a} // {b} = {a // b}")
print(f"Modulus: {a} % {b} = {a % b}")
print(f"Exponentiation: {a} ** {b} = {a ** b}")', 2),
(1, 'Strings', 'strings', 'Learn to work with strings in Python.', '<h2>Strings in Python</h2><p>Strings are sequences of characters enclosed in quotes. Python supports single, double, and triple quotes.</p><h3>String Operations</h3><ul><li><strong>Concatenation</strong> - Using + operator</li><li><strong>Repetition</strong> - Using * operator</li><li><strong>Indexing</strong> - Access characters by position</li><li><strong>Slicing</strong> - Extract substrings</li></ul>', '# String operations
greeting = "Hello"
name = "World"

# Concatenation
message = greeting + ", " + name + "!"
print(message)

# Repetition
echo = "echo " * 3
print(echo)

# Indexing (first character)
print(f"First character: {greeting[0]}")

# Slicing
print(f"Slice [1:4]: {greeting[1:4]}")

# Length
print(f"Length: {len(greeting)}")', 3),
(1, 'Lists', 'lists', 'Learn about Python lists and list operations.', '<h2>Lists</h2><p>Lists are ordered, mutable collections of items. They can contain elements of different types.</p><h3>Common List Operations</h3><ul><li><strong>append()</strong> - Add item to end</li><li><strong>insert()</strong> - Insert item at position</li><li><strong>remove()</strong> - Remove first occurrence</li><li><strong>pop()</strong> - Remove and return last item</li><li><strong>sort()</strong> - Sort the list</li></ul>', '# List operations
fruits = ["apple", "banana", "cherry"]

print(f"Original list: {fruits}")

# Add item
fruits.append("date")
print(f"After append: {fruits}")

# Insert item
fruits.insert(1, "apricot")
print(f"After insert: {fruits}")

# Remove item
fruits.remove("banana")
print(f"After remove: {fruits}")

# Pop item
last = fruits.pop()
print(f"Popped: {last}")
print(f"After pop: {fruits}")

# Sort
fruits.sort()
print(f"After sort: {fruits}")', 4);

-- ============================================
-- SEED DATA: PYTHON TASKS (Variables Lesson)
-- ============================================
INSERT INTO public.tasks (lesson_id, title, slug, problem_statement, starter_code, expected_output, difficulty, order_index) VALUES
(1, 'Declare Variables', 'declare-variables', 'Create variables for a person with name "John", age 25, and is_student True. Print them all.', 'name = __
age = __
is_student = __

print(name)
print(age)
print(is_student)', 'John\n25\nTrue', 'easy', 1),
(1, 'Swap Values', 'swap-values', 'Swap the values of two variables a and b. Start with a=5, b=10. After swapping, print a then b.', '__ = 5
__ = 10

# Your code here - swap the values

print(a)
print(b)', '10\n5', 'easy', 2),
(1, 'Calculate Area', 'calculate-area', 'Create a variable length=5, width=3, calculate area (length * width), and print the result.', '# Create variables for length and width
length = __
width = __

# Calculate area
area = __

print(area)', '15', 'easy', 3);

-- ============================================
-- SEED DATA: PYTHON TASKS (Basic Operations Lesson)
-- ============================================
INSERT INTO public.tasks (lesson_id, title, slug, problem_statement, starter_code, expected_output, difficulty, order_index) VALUES
(2, 'Simple Calculator', 'simple-calculator', 'Create two variables x=15 and y=4. Calculate and print: sum, difference, product, quotient, and remainder.', '__ = 15
__ = 4

sum_result = x + y
# Calculate the rest

print(sum_result)
print(difference_result)
print(product_result)
print(quotient_result)
print(remainder_result)', '19\n11\n60\n3.75\n3', 'easy', 1),
(2, 'Temperature Conversion', 'temperature-conversion', 'Convert 100 degrees Fahrenheit to Celsius. Formula: C = (F - 32) * 5/9. Print the result.', 'fahrenheit = __

celsius = (fahrenheit - 32) * 5 / 9

print(celsius)', '37.77777777777778', 'easy', 2);

-- ============================================
-- SEED DATA: JAVA LESSONS (Java Syntax)
-- ============================================
INSERT INTO public.lessons (course_id, title, slug, description, content_html, code_example, order_index) VALUES
(5, 'Variables and Data Types', 'java-variables-data-types', 'Learn about Java variables and primitive data types.', '<h2>Variables in Java</h2><p>Java is statically typed, so you must declare the type of a variable before using it.</h2><h3>Primitive Data Types</h3><ul><li><strong>int</strong> - 32-bit integer</li><li><strong>long</strong> - 64-bit integer</li><li><strong>double</strong> - 64-bit floating point</li><li><strong>float</strong> - 32-bit floating point</li><li><strong>char</strong> - Single character</li><li><strong>boolean</strong> - true or false</li></ul>', '// Variables and data types in Java
public class Main {
    public static void main(String[] args) {
        String name = "Alice";
        int age = 25;
        double height = 5.7;
        boolean isStudent = true;
        
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Height: " + height);
        System.out.println("Is student: " + isStudent);
    }
}', 1),
(5, 'Operators', 'java-operators', 'Learn about Java operators including arithmetic, comparison, and logical operators.', '<h2>Java Operators</h2><p>Java supports various operators for performing operations on variables and values.</p><h3>Arithmetic Operators</h3><p>+, -, *, /, % (modulus)</p><h3>Comparison Operators</h3><p>==, !=, >, <, >=, <=</p><h3>Logical Operators</h3><p>&& (AND), || (OR), ! (NOT)</p>', '// Operators in Java
public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 3;
        
        System.out.println("a + b = " + (a + b));
        System.out.println("a - b = " + (a - b));
        System.out.println("a * b = " + (a * b));
        System.out.println("a / b = " + (a / b));
        System.out.println("a % b = " + (a % b));
        
        // Comparison
        System.out.println("a > b: " + (a > b));
        System.out.println("a == b: " + (a == b));
    }
}', 2);

-- ============================================
-- SEED DATA: JAVA TASKS
-- ============================================
INSERT INTO public.tasks (lesson_id, title, slug, problem_statement, starter_code, expected_output, difficulty, order_index) VALUES
(13, 'Declare Variables', 'java-declare-variables', 'Create a Java program with variables: name (String) = "Bob", age (int) = 30, height (double) = 6.0, isEmployed (boolean) = true. Print them in order.', 'public class Main {
    public static void main(String[] args) {
        // Declare your variables here
        
        System.out.println(name);
        System.out.println(age);
        System.out.println(height);
        System.out.println(isEmployed);
    }
}', 'Bob\n30\n6.0\ntrue', 'easy', 1);

-- ============================================
-- SEED DATA: C LESSONS (C Basics)
-- ============================================
INSERT INTO public.lessons (course_id, title, slug, description, content_html, code_example, order_index) VALUES
(9, 'Variables and Types', 'c-variables-types', 'Learn about C variables and data types.', '<h2>Variables in C</h2><p>C is a statically typed language. You must declare the type of each variable.</p><h3>Basic Data Types</h3><ul><li><strong>int</strong> - Integer (e.g., 42)</li><li><strong>float</strong> - Floating point (e.g., 3.14)</li><li><strong>double</strong> - Double precision (e.g., 3.14159)</li><li><strong>char</strong> - Single character (e.g., &apos;A&apos;)</li></ul>', '// Variables in C
#include <stdio.h>

int main() {
    int age = 25;
    float price = 19.99;
    double pi = 3.14159265359;
    char grade = &apos;A&apos;;
    
    printf("Age: %d\n", age);
    printf("Price: %.2f\n", price);
    printf("Pi: %.10f\n", pi);
    printf("Grade: %c\n", grade);
    
    return 0;
}', 1),
(9, 'Control Structures', 'c-control-structures', 'Learn about if statements and loops in C.', '<h2>Control Structures in C</h2><p>C provides standard control flow statements including if-else, switch, and loops (for, while, do-while).</p><h3>If-Else Statement</h3><pre>if (condition) {
    // code
} else if (condition) {
    // code
} else {
    // code
}</pre>', '// Control structures in C
#include <stdio.h>

int main() {
    int number = 10;
    
    // If-else example
    if (number > 0) {
        printf("Positive number\n");
    } else if (number < 0) {
        printf("Negative number\n");
    } else {
        printf("Zero\n");
    }
    
    // For loop
    for (int i = 0; i < 5; i++) {
        printf("i = %d\n", i);
    }
    
    return 0;
}', 2);

-- ============================================
-- SEED DATA: C TASKS
-- ============================================
INSERT INTO public.tasks (lesson_id, title, slug, problem_statement, starter_code, expected_output, difficulty, order_index) VALUES
(17, 'Print Variables', 'c-print-variables', 'Create a C program with int x = 42, float y = 3.14. Print them on separate lines.', '#include <stdio.h>

int main() {
    int x = __;
    float y = __;
    
    printf("%d\n", x);
    printf("%.2f\n", y);
    
    return 0;
}', '42\n3.14', 'easy', 1);
